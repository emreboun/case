package com.balsnub.wiki_memory.auth.model;

import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;
import java.util.Objects;

@Document("user_auth_login_devices")
public class DeviceMetadata {

  @Id
  private ObjectId id;
  private String userId;
  private String deviceDetails;
  private String location;
  private Date lastLoggedIn;

  public ObjectId getId() {
    return id;
  }

  public void setId(ObjectId id) {
    this.id = id;
  }

  public String getUserId() {
    return userId;
  }

  public void setUserId(String userId) {
    this.userId = userId;
  }

  public String getDeviceDetails() {
    return deviceDetails;
  }

  public void setDeviceDetails(String deviceDetails) {
    this.deviceDetails = deviceDetails;
  }

  public String getLocation() {
    return location;
  }

  public void setLocation(String location) {
    this.location = location;
  }

  public Date getLastLoggedIn() {
    return lastLoggedIn;
  }

  public void setLastLoggedIn(Date lastLoggedIn) {
    this.lastLoggedIn = lastLoggedIn;
  }

  @Override
  public boolean equals(Object o) {
    if (this == o)
      return true;
    if (o == null || getClass() != o.getClass())
      return false;
    DeviceMetadata that = (DeviceMetadata) o;
    return Objects.equals(getId(), that.getId()) &&
        Objects.equals(getUserId(), that.getUserId()) &&
        Objects.equals(getDeviceDetails(), that.getDeviceDetails()) &&
        Objects.equals(getLocation(), that.getLocation()) &&
        Objects.equals(getLastLoggedIn(), that.getLastLoggedIn());
  }

  @Override
  public int hashCode() {
    return Objects.hash(getId(), getUserId(), getDeviceDetails(), getLocation(), getLastLoggedIn());
  }

  @Override
  public String toString() {
    final StringBuilder sb = new StringBuilder("DeviceMetadata{");
    sb.append("id=").append(id);
    sb.append(", userId=").append(userId);
    sb.append(", deviceDetails='").append(deviceDetails).append('\'');
    sb.append(", location='").append(location).append('\'');
    sb.append(", lastLoggedIn=").append(lastLoggedIn);
    sb.append('}');
    return sb.toString();
  }
}
