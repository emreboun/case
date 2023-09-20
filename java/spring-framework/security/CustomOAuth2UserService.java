package com.balsnub.wiki_memory.security.oauth2;

import com.balsnub.wiki_memory.auth.dao.UserUpdateRepository;
import com.balsnub.wiki_memory.auth.dao.UserRoleRepository;
import com.balsnub.wiki_memory.auth.exception.OAuth2AuthenticationProcessingException;
import com.balsnub.wiki_memory.auth.model.UserAccount;
import com.balsnub.wiki_memory.auth.partial.UserPrincipalOauth;
import com.balsnub.wiki_memory.model.data.user.UserUtil;
import com.balsnub.wiki_memory.repository.user.UserUtilRepository;
import com.balsnub.wiki_memory.security.oauth2.user.OAuth2UserInfo;
import com.balsnub.wiki_memory.security.oauth2.user.OAuth2UserInfoFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.InternalAuthenticationServiceException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.*;

@Service
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

  private final UserUpdateRepository userRepository;

  private final UserRoleRepository roleRepository;

  private final UserUtilRepository userUtilRepository;

  @Autowired
  public CustomOAuth2UserService(UserUpdateRepository userRepository, UserRoleRepository roleRepository,
      UserUtilRepository userUtilRepository) {
    this.userRepository = userRepository;
    this.roleRepository = roleRepository;
    this.userUtilRepository = userUtilRepository;
  }

  @Override
  public OAuth2User loadUser(OAuth2UserRequest oAuth2UserRequest) throws OAuth2AuthenticationException {
    OAuth2User oAuth2User = super.loadUser(oAuth2UserRequest);

    try {
      return processOAuth2User(oAuth2UserRequest, oAuth2User);
    } catch (AuthenticationException ex) {
      throw ex;
    } catch (Exception ex) {
      // Throwing an instance of AuthenticationException will trigger the
      // OAuth2AuthenticationFailureHandler
      throw new InternalAuthenticationServiceException(ex.getMessage(), ex.getCause());
    }
  }

  private OAuth2User processOAuth2User(OAuth2UserRequest oAuth2UserRequest, OAuth2User oAuth2User) {
    OAuth2UserInfo oAuth2UserInfo = OAuth2UserInfoFactory
        .getOAuth2UserInfo(oAuth2UserRequest.getClientRegistration().getRegistrationId(), oAuth2User.getAttributes());
    if (StringUtils.isEmpty(oAuth2UserInfo.getEmail())) {
      throw new OAuth2AuthenticationProcessingException("Email not found from OAuth2 provider");
    }

    Optional<UserAccount> userOptional = userRepository.findByEmail(oAuth2UserInfo.getEmail());
    UserAccount user;
    if (userOptional.isPresent()) {
      user = userOptional.get();
      if (user.getProvider() == null) {

      } else if (!user.getProvider()
          .equals(AuthProvider.valueOf(oAuth2UserRequest.getClientRegistration().getRegistrationId()))) {
        throw new OAuth2AuthenticationProcessingException("Looks like you're signed up with " +
            user.getProvider() + " account. Please use your " + user.getProvider() +
            " account to login.");
      }
      user = updateExistingUser(user, oAuth2UserInfo);
    } else {
      user = registerNewUser(oAuth2UserRequest, oAuth2UserInfo);
    }

    return UserPrincipalOauth.create(user, oAuth2User.getAttributes());
  }

  private UserAccount registerNewUser(OAuth2UserRequest oAuth2UserRequest, OAuth2UserInfo oAuth2UserInfo) {
    UserAccount user = new UserAccount();

    user.setProvider(AuthProvider.valueOf(oAuth2UserRequest.getClientRegistration().getRegistrationId()));
    user.setProviderId(oAuth2UserInfo.getId());
    user.setName(oAuth2UserInfo.getName());
    user.setEmail(oAuth2UserInfo.getEmail());
    user.setAvatarUrl(oAuth2UserInfo.getImageUrl());

    user.setUsername(oAuth2UserInfo.getEmail());

    user.setRoles(Arrays.asList(roleRepository.findByName("COMMON_USER")));

    user.setRepos(new ArrayList<>());

    user.setAccountNonExpired(true);
    user.setAccountNonLocked(true);
    user.setEnabled(true);
    user.setCredentialsNonExpired(true);

    userRepository.save(user);

    // util

    UserUtil userUtil = new UserUtil();

    userUtil.setId(user.getId());
    userUtil.setUsername(user.getUsername());
    userUtil.setName(user.getName());

    userUtil.setAvatarUrl(oAuth2UserInfo.getImageUrl());

    userUtil.setFollowedRepos(new ArrayList<>());
    userUtil.setRepos(new ArrayList<>());

    userUtilRepository.save(userUtil);

    return user;
  }

  private UserAccount updateExistingUser(UserAccount existingUser, OAuth2UserInfo oAuth2UserInfo) {
    existingUser.setName(oAuth2UserInfo.getName());
    existingUser.setAvatarUrl(oAuth2UserInfo.getImageUrl());

    UserUtil userUtil = userUtilRepository.getById(existingUser.getId().toString());

    userUtil.setName(oAuth2UserInfo.getName());
    userUtil.setAvatarUrl(oAuth2UserInfo.getImageUrl());

    userUtilRepository.save(userUtil);
    return userRepository.save(existingUser);
  }

}
