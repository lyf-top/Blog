---

title: SpringSecurity
description: 🥧SpringSecurity+jwt安全认证
image: 'https://img.f3f3.top/img/2026/04/28/87ab7f6d31b8b767723c61db968f171c.webp'#文章封面页
tags:
  - 项目登录认证
category: java项目 
  #永久连接id
abbrlink: "748474325"
# 文章置顶
pinned: true #文章置顶
published: 2026-08-09 18:19:03
updated: 2026-08-09 10:43:08
---

## 初识

Spring 生态的安全框架，基于**AOP 和 Servlet 过滤器链**实现，提供 Web 请求和方法调用级的**认证（是否能访问系统）\**和\**授权（是否有权限操作）**，自包含部署无需额外配置文件。

```
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-security</artifactId>
</dependency>
```

**引入`spring-boot-starter-security`依赖后，框架自动开启接口保护，默认生成用户名`user`，密码控制台随机生成，跳转默认登录页。**

## 认证

### UserDetailService

```
@Service
public class CustomUserDetailsService implements UserDetailsService {
 
    // 注入MyBatis的Mapper（替代之前的JPA Repository）
    @Autowired
    private UserMapper userMapper;
 
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        // 1. 通过Mapper从数据库查询用户（含角色）
        SysUser sysUser = userMapper.selectUserByUsername(username);
        
        // 2. 用户不存在则抛出异常（Spring Security会捕获并处理）
        if (sysUser == null) {
            throw new UsernameNotFoundException("用户名不存在：" + username);
        }
 
        // 3. 转换为Spring Security的UserDetails对象
        // 处理角色：拼接ROLE_前缀（Spring Security的权限命名规范）
        List<GrantedAuthority> authorities =       sysUser.getRoles().stream()
                .map(role -> new SimpleGrantedAuthority("ROLE_" + role.getRoleName()))
                .collect(Collectors.toList());
 
        // 构建UserDetails（核心：用户名、加密密码、权限列表）
        return User.withUsername(sysUser.getUsername())
                .password(sysUser.getPassword()) // 数据库中已加密的密码
                .authorities(authorities) // 用户权限
                .accountExpired(false) // 账号未过期
                .accountLocked(false) // 账号未锁定
                .credentialsExpired(false) // 凭证未过期
                .enabled(true) // 账号启用（已通过SQL的status=1过滤）
                .build();
    }
}
```

- 对应图中`DaoAuthenticationProvider`调用`loadUserByUsername`的环节。
- 你需要实现这个接口，告诉 Spring Security**如何从你的数据源（数据库）加载用户信息**，包括用户名、加密密码和权限列表。

### 配置类

```
@Configuration
@EnableWebSecurity
public class SecurityConfig {
 
    private final UserDetailsService userDetailsService;
    private final PasswordEncoder passwordEncoder;
    
    // 构造注入
    public SecurityConfig(UserDetailsService userDetailsService, PasswordEncoder passwordEncoder) { 
        this.userDetailsService = userDetailsService;
        this.passwordEncoder = passwordEncoder;
    }
 
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(); // 配置密码编辑器
    }
 
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/login", "/static/**", "/public/**").permitAll() // 公开接口
                .anyRequest().authenticated() // 其他请求需要认证
            )
            .formLogin(form -> form
                .loginPage("/login") // 自定义登录页面（可选）
                .loginProcessingUrl("/doLogin") // 处理登录请求的URL，对应图中的POST /login
                .usernameParameter("username") // 登录表单中用户名的参数名
                .passwordParameter("password") // 登录表单中密码的参数名
                .defaultSuccessUrl("/index", true) // 登录成功后的跳转页面
                .failureUrl("/login?error") // 登录失败后的跳转页面
            )
            .logout(logout -> logout
                .logoutUrl("/logout")
                .logoutSuccessUrl("/login?logout")
            )
            .csrf(csrf -> csrf.disable()); // 前后端分离时通常关闭CSRF保护
 
        return http.build();
    }
 
    // 配置AuthenticationManager使用自定义的UserDetailsService和PasswordEncoder
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
}
```

- **这是整个认证流程的总控台，对应图中的DaoAuthenticationProvider调用passwordEncoder.matches()、UsernamePasswordAuthenticationFilter和AuthenticationManager。**

- **Spring Security 要求密码必须加密存储，BCryptPasswordEncoder是推荐的实现，它会自动处理加盐和验证，防止彩虹表攻击。**

- **定义哪些 URL 需要保护，哪些可以公开访问。**

- **配置登录表单的参数和行为，让UsernamePasswordAuthenticationFilter知道从哪里获取用户名和密码。**

- **配置登出逻辑。**

- **构建AuthenticationManager，它会自动使用你提供的UserDetailsService和PasswordEncoder。**

## 授权

### 授权规则

```
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            // ========== 授权规则核心配置 ==========
            .authorizeHttpRequests(auth -> auth
                // 1. 公开接口：所有人可访问（无需授权）
                .requestMatchers("/", "/login", "/public/**").permitAll()
                
                // 2. 管理员接口：仅拥有ROLE_ADMIN权限的用户可访问
                .requestMatchers("/admin/**").hasRole("ADMIN")
                
                // 3. 普通用户接口：拥有ROLE_USER或ROLE_ADMIN均可访问
                .requestMatchers("/user/**").hasAnyRole("USER", "ADMIN")
                
                // 4. 精确URL权限：需要特定权限（非角色，自定义权限）
                .requestMatchers("/order/create").hasAuthority("ORDER_CREATE")
                
                // 5. 剩余所有请求：必须认证（登录后）才能访问
                .anyRequest().authenticated()
            )
            // 认证相关配置（复用之前的登录/登出）
            .formLogin(form -> form
                .loginPage("/login")
                .loginProcessingUrl("/doLogin")
                .permitAll()
            )
            // 403异常处理（授权失败）
            .exceptionHandling(ex -> ex
                .accessDeniedPage("/403") // 授权失败跳转页面（前后端分离可换JSON处理器）
                // 前后端分离场景：自定义403返回JSON
                // .accessDeniedHandler(customAccessDeniedHandler())
            );
 
        return http.build();
    }
```

**对应时序图中`SecurityMetadataSource`获取权限规则的环节。**

### 方法级授权

**在配置类SecurityConfig上加上@EnableMethodSecurity(prePostEnabled = true)注解，即开启PreAuthorize/PostAuthorize注解了**

```
@Service
public class AdminService {
 
    // 仅允许ADMIN角色调用该方法
    @PreAuthorize("hasRole('ADMIN')")
    public void deleteUser(Long userId) {
        // 业务逻辑：删除用户
    }
 
    // 允许USER或ADMIN角色，且用户ID匹配（自定义EL表达式）
    @PreAuthorize("hasAnyRole('USER','ADMIN') and authentication.name == #username")
    public UserInfo getUserInfo(String username) {
        // 业务逻辑：查询用户信息
    }
 
    // 方法执行后验证权限（很少用）
    @PostAuthorize("returnObject.username == authentication.name")
    public UserInfo getCurrentUserInfo() {
        // 业务逻辑：返回当前用户信息
    }
}
```

- **URL 级授权是 “粗粒度” 的（控制整个接口），方法级授权是 “细粒度” 的（控制单个业务方法）；**
  **@PreAuthorize在方法执行前验证权限，是最常用的方法级授权注解；**
  **支持 Spring EL 表达式，可直接引用方法参数、当前用户信息，实现灵活的权限判断。**
  **注意：**
- **角色（Role）：是一种特殊的权限，Spring Security 默认会给角色加ROLE_前缀（如hasRole("ADMIN")实际匹配ROLE_ADMIN）；**

- **权限（Authority）：更细粒度的权限（如ORDER_CREATE、USER_EDIT），无默认前缀，用hasAuthority()判断；**

- **建议：角色用于大分类（ADMIN/USER），权限用于具体操作（ORDER_CREATE/USER_EDIT），组合使用更灵活。**
  
