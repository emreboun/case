package com.balsnub.wiki_memory.auth.service;

import com.balsnub.wiki_memory.auth.dao.PasswordResetTokenRepository;
import com.balsnub.wiki_memory.auth.model.PasswordResetToken;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Calendar;

@Service
@Transactional
public class PasswordResetService implements ISecurityUserService {
  private final Logger LOGGER = LoggerFactory.getLogger(getClass());

  @Autowired
  private PasswordResetTokenRepository passwordTokenRepository;

  @Override
  public String validatePasswordResetToken(String token) {

    LOGGER.debug("Validate pass reset token: {}.", token);

    final PasswordResetToken passToken = passwordTokenRepository.findByToken(token);

    LOGGER.debug("Validate passToken Object: {}.", passToken);

    return !isTokenFound(passToken) ? "invalidToken"
        : isTokenExpired(passToken) ? "expired"
            : null;
  }

  private boolean isTokenFound(PasswordResetToken passToken) {
    return passToken != null;
  }

  private boolean isTokenExpired(PasswordResetToken passToken) {
    final Calendar cal = Calendar.getInstance();
    return passToken.getExpiryDate().before(cal.getTime());
  }
}