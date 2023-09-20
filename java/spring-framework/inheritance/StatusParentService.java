package com.balsnub.wiki_memory.service.common;

import com.balsnub.wiki_memory.model.inheritance.hierarchy.WithChildren;
import com.balsnub.wiki_memory.model.inheritance.hierarchy.WithStatusAndParent;
import com.balsnub.wiki_memory.repository.common.property.StatusRepository;
import com.balsnub.wiki_memory.service.common.molecular.auth.PrivilegeInnerService;
import org.bson.types.ObjectId;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface StatusParentService<T extends WithStatusAndParent<?, String>, S extends WithChildren<ObjectId>> {

  <K extends StatusRepository> K getRepo();

  <K extends PrivilegeInnerService> K getParentService();

  @Transactional(readOnly = true)
  default List<T> findAllByStatus(Boolean status) {
    return getRepo().findAllByStatus(status);
  }

  @Transactional(readOnly = true)
  default <K> List<K> findAllByStatus(Boolean status, Class<K> clazz) {
    return getRepo().findAllByStatus(status, clazz);
  }

  @Transactional
  default Boolean delete(String id) {
    T item = (T) getRepo().getById(id);

    S parent = (S) getParentService().getById(item.getParentId());

    // TODO: repo module ilişkisi için geçici (recycle bin)
    if (item.getChildCode().equals(101)) {
      parent.getChildren(111).add(
          parent.getChildren(item.getChildCode())
              .stream()
              .filter(e -> e.getId().equals(item.getId())).findFirst()
              .orElseThrow());
    }
    if (!parent.getChildren(item.getChildCode()).removeIf(element -> element.getId().equals(item.getId()))) {
      throw new IllegalArgumentException("Nothing to remove.");
    }

    item.setStatus(false);

    getRepo().save(item);

    getParentService().getRepo().save(parent);

    return true;
  }
}
