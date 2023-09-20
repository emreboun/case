package com.balsnub.wiki_memory.service.common.atomic;

import com.balsnub.wiki_memory.repository.common.atomic.BaseAtomicRepository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface CollectionService<T> {

  <T extends BaseAtomicRepository> T getRepo();

  @Transactional(readOnly = true)
  default List<T> findAll() {
    return getRepo().findAll();
  }

  @Transactional(readOnly = true)
  default <T> List<T> findAllBy(Class<T> clazz) {
    return getRepo().findAllBy(clazz);
  }

  @Transactional(readOnly = true)
  default List<T> findAllByIdIn(List<String> ids) {
    return getRepo().findAllByIdIn(ids);
  }

  @Transactional(readOnly = true)
  default <T> List<T> findAllByIdIn(List<String> ids, Class<T> clazz) {
    return getRepo().findAllByIdIn(ids, clazz);
  }

  @Transactional(readOnly = true)
  default Long count() {
    return getRepo().count();
  }

}
