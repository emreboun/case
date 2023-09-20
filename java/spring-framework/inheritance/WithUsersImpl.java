package com.balsnub.wiki_memory.model.inheritance;

import com.balsnub.wiki_memory.model.data.user.partial.IdUsername;
import lombok.*;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.core.mapping.Field;

import java.util.List;

@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@ToString
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class WithUsersImpl implements WithUsers<IdUsername> {

  @Field("name")
  private String name;

  @Field("createdByUser")
  private String createdByUser;

  @EqualsAndHashCode.Include
  private ObjectId id;

  @Field("users")
  private List<IdUsername> users;

  @Field("pendUsers")
  private List<IdUsername> pendingUsers;

  @Override
  public Integer getUserCode() {
    return null;
  }

  @Override
  public Boolean getIsPublic() {
    return null;
  }

  @Override
  public void setIsPublic(Boolean bool) {

  }

  @Override
  public Boolean getStatus() {
    return null;
  }

  @Override
  public void setStatus(Boolean bool) {

  }

  @Override
  public Boolean getIsVisible() {
    return null;
  }

  @Override
  public void setIsVisible(Boolean bool) {

  }
}
