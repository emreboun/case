package com.balsnub.wiki_memory.auth.validation;

import java.util.Arrays;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;

import org.passay.*;

import com.google.common.base.Joiner;

public class PasswordConstraintValidator implements ConstraintValidator<ValidPassword, String> {

  @Override
  public void initialize(final ValidPassword arg0) {

  }

  @Override
  public boolean isValid(final String password, final ConstraintValidatorContext context) {
    // @formatter:off
        final PasswordValidator validator = new PasswordValidator(Arrays.asList(
            new LengthRule(8, 30),
            new UppercaseCharacterRule(1),
            new AlphabeticalCharacterRule(1),
            new DigitCharacterRule(1),
            new SpecialCharacterRule(1),
            new QwertySequenceRule(3,false),
            new WhitespaceRule()));
        final PasswordData data = new PasswordData(password);


        final RuleResult result = validator.validate(data);
        if (result.isValid()) {
            return true;
        }
        context.disableDefaultConstraintViolation();
        context.buildConstraintViolationWithTemplate(Joiner.on(",").join(validator.getMessages(result))).addConstraintViolation();
        return false;
    }

}
