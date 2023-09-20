package com.balsnub.wiki_memory.auth.validation;

import com.google.common.base.Joiner;
import org.passay.*;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;
import java.util.Arrays;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class UsernameConstraintValidator implements ConstraintValidator<ValidUsername, String> {

  private static final String USERNAME_PATTERN = "^(?=.{4,15}$)(?!.*[__]{2})[a-zA-Z0-9_]+";
  private static final Pattern PATTERN = Pattern.compile(USERNAME_PATTERN);

  @Override
  public void initialize(final ValidUsername arg0) {

  }

  @Override
  public boolean isValid(final String username, final ConstraintValidatorContext context) {
    return (validateUsername(username));
  }

  private boolean validateUsername(final String username) {
    Matcher matcher = PATTERN.matcher(username);
    return matcher.matches();
  }

}
