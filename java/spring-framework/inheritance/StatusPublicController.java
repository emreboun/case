package com.balsnub.wiki_memory.controller.common;

import com.balsnub.wiki_memory.model.inheritance.WithUsers;
import com.balsnub.wiki_memory.model.data.user.partial.IdUsername;
import com.balsnub.wiki_memory.service.common.property.StatusIsPublicService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

public interface StatusPublicController<T extends WithUsers<IdUsername>, S> {
  Integer getClassCode();

  Class<S> getZeroDtoClass();

  <T extends StatusIsPublicService> T getService();

  // status, public OR user
  @RequestMapping(path = "/findall", method = RequestMethod.GET, produces = "application/json")
  @PreAuthorize("hasAuthority('module:read')")
  default ResponseEntity findAll() {
    return new ResponseEntity(getService().findAllByPubAndStatusOrUsers(getZeroDtoClass(), getClassCode()),
        HttpStatus.OK);
  }

  // status, public
  @RequestMapping(path = "/findall/pub-status", method = RequestMethod.GET, produces = "application/json")
  @PreAuthorize("hasAuthority('module:read')")
  default ResponseEntity findAllPubAndStatus() {
    return new ResponseEntity(getService().findAllByPubAndStatus(true, true, getZeroDtoClass()), HttpStatus.OK);
  }

  @RequestMapping(path = "/admin/empty", method = RequestMethod.PATCH, produces = "application/json")
  @PreAuthorize("hasAuthority('ADMIN_SNOOP')")
  default ResponseEntity emptyRecycleBin() {
    return new ResponseEntity(getService().emptyRecycleBin(), HttpStatus.OK);
  }

  @RequestMapping(path = "/admin/refresh", method = RequestMethod.PATCH, produces = "application/json")
  @PreAuthorize("hasAuthority('STAFF_CREW')")
  default ResponseEntity refresh() {
    return new ResponseEntity(getService().refresh(), HttpStatus.OK);
  }
}
