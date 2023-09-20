package com.balsnub.wiki_memory.auth.partial;

import com.balsnub.wiki_memory.auth.model.UserAccount;
import com.balsnub.wiki_memory.auth.model.UserRole;
import lombok.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.oauth2.core.user.OAuth2User;

import java.util.*;
import java.util.stream.Collectors;

@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@ToString
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class UserPrincipalOAuth implements OAuth2User, UserDetails {
  @EqualsAndHashCode.Include
  private String id;

  private String email;

  private String password;

  private Collection<? extends GrantedAuthority> authorities;

  private Map<String, Object> attributes;

  public UserPrincipalOauth(String id, String email, String password, Collection<? extends GrantedAuthority> authorities) {
        this.id = id;
        this.email = email;
        this.password = password;
        this.authorities = authorities;
    }

  public static UserPrincipalOauth create(UserAccount user) {
    return new UserPrincipalOauth(
        user.getId().toString(),
        user.getEmail(),
        user.getPassword(),
        getAuthorities(user.getRoles()));
  }

  public static UserPrincipalOauth create(UserAccount user, Map<String, Object> attributes) {
    UserPrincipalOauth userPrincipal = UserPrincipalOauth.create(user);
    userPrincipal.setAttributes(attributes);
    return userPrincipal;
  }

  private static Collection<? extends GrantedAuthority> getAuthorities(Collection<UserRole> roles) {
    List<GrantedAuthority> authorities = new ArrayList<>();
    for (UserRole role : roles) {
      authorities.add(new SimpleGrantedAuthority(role.getName()));
      authorities.addAll(role.getPermissions()
          .stream()
          .map(p -> new SimpleGrantedAuthority(p.getName()))
          .collect(Collectors.toList()));
    }
    return authorities;
  }

  public String getId() {
    return id;
  }

  public void setId(String id) {
    this.id = id;
  }

  public void setEmail(String email) {
    this.email = email;
  }

  public void setPassword(String password) {
    this.password = password;
  }

  public void setAuthorities(Collection<? extends GrantedAuthority> authorities) {
    this.authorities = authorities;
  }

  public String getEmail() {
    return email;
  }

  @Override
  public String getPassword() {
    return password;
  }

  @Override
  public String getUsername() {
    return email;
  }

  @Override
  public boolean isAccountNonExpired() {
    return true;
  }

  @Override
  public boolean isAccountNonLocked() {
    return true;
  }

  @Override
  public boolean isCredentialsNonExpired() {
    return true;
  }

  @Override
  public boolean isEnabled() {
    return true;
  }

  @Override
  public Collection<? extends GrantedAuthority> getAuthorities() {
    return authorities;
  }

  @Override
  public Map<String, Object> getAttributes() {
    return attributes;
  }

  public void setAttributes(Map<String, Object> attributes) {
    this.attributes = attributes;
  }

  @Override
  public String getName() {
    return String.valueOf(id);
  }

}
