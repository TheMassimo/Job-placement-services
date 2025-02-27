package com.example.analytics.security

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
            .authorizeHttpRequests { it.anyRequest().permitAll() } // Permette tutte le richieste
            .oauth2ResourceServer { it.disable() } // Disabilita il server di risorse OAuth2
            .sessionManagement { it.sessionCreationPolicy(SessionCreationPolicy.STATELESS) }
            .csrf { it.disable() }
            .cors { it.configurationSource(corsConfigurationSource()) } // Usa la configurazione CORS
            .build()
    }

    // Configura CORS globalmente
    private fun corsConfigurationSource(): org.springframework.web.cors.UrlBasedCorsConfigurationSource {
        val source = org.springframework.web.cors.UrlBasedCorsConfigurationSource()
        val config = org.springframework.web.cors.CorsConfiguration()
        config.allowedOriginPatterns = listOf("http://localhost:*", "http://*.anotherdomain.com") // Pattern con wildcard
        config.allowedMethods = listOf("GET", "POST", "PUT", "DELETE", "OPTIONS") // Aggiungi i metodi necessari
        config.allowedHeaders = listOf("*") // Permetti tutte le intestazioni
        config.allowCredentials = true // Consenti l'invio di credenziali (se necessario)
        source.registerCorsConfiguration("/**", config) // Applica la configurazione a tutte le rotte
        return source
    }

    fun filterChain_2(http: HttpSecurity): SecurityFilterChain {
        return http
            .authorizeHttpRequests {
                it.requestMatchers(HttpMethod.GET, "/API/**").hasAnyAuthority("ROLE_guest", "ROLE_manager", "ROLE_operator")
                it.requestMatchers(HttpMethod.POST, "/API/**").hasAnyAuthority("ROLE_manager", "ROLE_operator")
                it.requestMatchers(HttpMethod.PUT, "/API/**").hasAnyAuthority("ROLE_manager", "ROLE_operator")
                it.requestMatchers(HttpMethod.DELETE, "/API/**").hasAnyAuthority("ROLE_manager")

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

