package com.example.document_store.security

import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.http.HttpMethod
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity
import org.springframework.security.config.http.SessionCreationPolicy
import org.springframework.security.web.SecurityFilterChain


@Configuration
@EnableWebSecurity
class SecurityConfig(private val jwtAuthConverter: JwtAuthConverter) {

    @Bean
    fun filterChain(http: HttpSecurity): SecurityFilterChain {
        return http
            .authorizeHttpRequests {
                it.requestMatchers(HttpMethod.GET, "/API/documents").hasAnyAuthority("ROLE_manager", "ROLE_operator", "ROLE_guest")
                it.requestMatchers(HttpMethod.GET, "/API/documents/{id}").hasAnyAuthority("ROLE_manager", "ROLE_operator", "ROLE_guest")
                it.requestMatchers(HttpMethod.GET, "/API/documents/{id}/data").hasAnyAuthority("ROLE_manager", "ROLE_operator", "ROLE_guest")
                it.requestMatchers(HttpMethod.POST, "/API/documents").hasAnyAuthority("ROLE_manager", "ROLE_operator")
                it.requestMatchers(HttpMethod.PUT, "/API/documents/{id}").hasAnyAuthority("ROLE_manager", "ROLE_operator")
                it.requestMatchers(HttpMethod.DELETE, "/API/documents/{id}").hasAnyAuthority("ROLE_manager")

                //it.anyRequest().denyAll()
                it.anyRequest().permitAll()
            }
            .oauth2ResourceServer {
                it.jwt { jwtConfigurer ->
                    jwtConfigurer.jwtAuthenticationConverter(jwtAuthConverter)
                }
            }
            .sessionManagement { it.sessionCreationPolicy(SessionCreationPolicy.STATELESS) }
            .csrf { it.disable() }
            .cors { it.disable() }
            //.formLogin { it.disable() } per ora è commentato, poi con il frontend si può disabilitare
            .build()
    }

}