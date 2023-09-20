package com.balsnub.wiki_memory.model.data.module;

import com.balsnub.wiki_memory.model.inheritance.audit.WithAudit;
import com.balsnub.wiki_memory.model.inheritance.hierarchy.WithStatusAndParent;
import com.balsnub.wiki_memory.model.data.module.inner.ModuleTypeAtModule;
import com.balsnub.wiki_memory.model.data.relation.IdNameTuple;
import com.balsnub.wiki_memory.model.inheritance.molecular.ImageNameDescription;

public interface BaseModule extends
    WithAudit,
    WithStatusAndParent<IdNameTuple, String>,
    ImageNameDescription {
  ModuleTypeAtModule getModuleType();
}
