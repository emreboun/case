import React, { useState, useEffect, useRef } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Modal,
  BackHandler,
} from "react-native";
import MapView, { Marker, LatLng, Region } from "react-native-maps";
import { MaterialIcons } from "@expo/vector-icons";

import {
  Location,
  SEHIRLER,
  ILCELER,
  MAHALLELER,
} from "../../constants/location";
import { getCurrentAddress, getCurrentCoords } from "./utils";
import { Address } from "./types";
import { SubmitButton } from "../button";
import { SelectForm } from "../input/select";
import { AddressForm } from "./form";

const ISTANBUL: Region = {
  latitude: 41.0082,
  longitude: 28.9784,
  latitudeDelta: 0.5592,
  longitudeDelta: 0.0022,
};
const CURRENT_DELTAS = {
  latitudeDelta: 0.0092,
  longitudeDelta: 0.0022,
};

const LOCATIONS = [
  {
    title: "Şehir Seçiniz",
    data: SEHIRLER,
  },
  {
    title: "İlçe Seçiniz",
    data: ILCELER,
  },
  {
    title: "Mahalle Seçiniz",
    data: MAHALLELER,
  },
];

export interface Coords {
  lat: number;
  lon: number;
}

export interface Props {
  markerList: Address[];
  onSubmit: (address: Address) => void;
}

const LocationPicker: React.FC<Props> = ({ markerList, onSubmit }) => {
  const mapRef = useRef<MapView | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [modal, setModal] = useState(0);
  const [showPin, setShowPin] = useState(false);
  const [phase, setPhase] = useState(false);

  const [address, setAddress] = useState<Address>({
    title: "",
    city: "",
    subregion: "",
    district: "",
    street: "",
    streetNo: "",
    flatNo: "",
    lat: -1,
    lon: -1,
  });

  const [city, setCity] = useState<Location | null>(null);
  const [subregion, setSubregion] = useState<Location | null>(null);

  // Custom back button handler for Android
  const handleBackButton = () => {
    if (phase) {
      setPhase(false);
      return true;
    } else {
      return false;
    }
  };

  useEffect(() => {
    BackHandler.addEventListener("hardwareBackPress", handleBackButton);
    return () => {
      BackHandler.removeEventListener("hardwareBackPress", handleBackButton);
    };
  }, [phase]);

  useEffect(() => {
    handleShowLocation();
  }, []);

  useEffect(() => {
    !mapRef || handleShowLocation();
  }, [mapRef]);

  const handleRegionChange = (region: Region) => {
    setShowPin(true);
    getCurrentAddress(region).then(
      (address) => !address || setAddress(address)
    );
  };

  const handleRegionChangeStart = (region: Region) => {
    setShowPin(false);
  };

  const handleGoLocation = (r: LatLng) => {
    const { latitude, longitude } = r;
    !mapRef.current ||
      mapRef.current.animateToRegion(
        {
          latitude,
          longitude,
          ...CURRENT_DELTAS,
        },
        1800
      );
  };

  const handleShowLocation = async () => {
    getCurrentCoords()
      .then((r) => {
        if (r) {
          handleGoLocation(r);
        }
      })
      .catch((e) => {
        // temp
      });
  };

  const handleLocationChange = (location: Location) => {
    switch (modal) {
      case 0:
        setAddress((prevAddress) => ({
          ...prevAddress,
          city: location.value,
          subregion: "",
          district: "",
        }));
        setCity(location);
        break;
      case 1:
        setAddress((prevAddress) => ({
          ...prevAddress,
          subregion: location.value,
          district: "",
        }));
        setSubregion(location);
        break;
      case 2:
        setAddress((prevAddress) => ({
          ...prevAddress,
          district: location.value,
        }));
        break;
    }
    setModalVisible(false);
  };

  const handleModal = (index: number) => {
    setModal(index);
    setModalVisible(true);
  };

  const handleMapSubmit = async () => {
    //deleted
    setPhase(true);
  };

  const handleSubmit = () => {
    onSubmit(address);
  };

  return (
    <>
      <Modal
        animationType="fade"
        transparent={false}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <SelectForm
          title={LOCATIONS[modal].title}
          data={
            modal === 0
              ? SEHIRLER
              : modal === 1
              ? ILCELER[Number(city?.key)]
              : MAHALLELER[Number(subregion?.key)]
          }
          handleClose={() => setModalVisible(false)}
          handleSelect={handleLocationChange}
        />
      </Modal>

      <View style={styles.container}>
        <View style={styles.mapContainer}>
          <MapView
            ref={mapRef}
            style={styles.map}
            initialRegion={ISTANBUL}
            onRegionChangeComplete={handleRegionChange}
            onRegionChange={handleRegionChangeStart}
            showsBuildings
            zoomEnabled
          >
            {markerList.map((address, index) => (
              <Marker
                key={index}
                coordinate={{ latitude: address.lat, longitude: address.lon }}
                title={address.title}
                description={address.city}
                style={{ backgroundColor: "green" }}
              />
            ))}
          </MapView>

          <TouchableOpacity
            style={{
              position: "absolute",
              bottom: 10,
              right: 10,
              backgroundColor: "#fff",
              padding: 10,
              borderRadius: 25,
              borderWidth: 0.4,
              elevation: 1,
            }}
            onPress={handleShowLocation}
          >
            <MaterialIcons name="my-location" size={22} color="grey" />
          </TouchableOpacity>

          {showPin && (
            <View style={styles.centerPoint}>
              <View
                style={[
                  styles.centerMarker,
                  { backgroundColor: "transparent" },
                ]}
              >
                <MaterialIcons
                  name="location-pin"
                  color={"#FF0F0F"}
                  size={32}
                />
                <View style={styles.circle} />
              </View>
            </View>
          )}
        </View>

        {phase && (
          <View
            style={{
              position: "absolute",
              width: "100%",
              backgroundColor: "#fff",
              marginTop: -30,
              paddingTop: 30,
              height: "100%",
            }}
          >
            <AddressForm
              setAddress={setAddress}
              handleModal={handleModal}
              address={address}
            />
          </View>
        )}

        <View style={styles.footer}>
          <SubmitButton
            title={
              !phase
                ? "Devam Et"
                : markerList.length === 0
                ? "Üyeliği Tamamla"
                : "Adresi Oluştur"
            }
            disabled={
              !phase
                ? false
                : address.district === "" ||
                  address.street === "" ||
                  address.title === ""
            }
            onClick={!phase ? handleMapSubmit : handleSubmit}
          />
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mapContainer: {
    flex: 1,
    marginTop: -30,
  },
  map: {
    width: "100%",
    height: "100%",
    position: "relative",
  },
  centerPoint: {
    position: "absolute",
    left: "50%",
    right: "50%",
    top: "50%",
  },
  centerMarker: {
    marginTop: -36,
    marginLeft: -14,
    width: 40,
    height: 40,
    left: "50%",
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
  },
  circle: {
    marginTop: -8,
    width: 14,
    height: 11,
    backgroundColor: "transparent",
    borderRadius: 32,
    borderWidth: 1.4,
    borderColor: "#FF0F0F",
    transform: [{ scaleX: 1.6 }],
  },
  footer: {
    flex: 0,
    paddingHorizontal: 8,
    paddingBottom: 4,
    borderTopWidth: 0.5,
    borderColor: "lightgrey",
    backgroundColor: "#fff",
  },
});

export default LocationPicker;
export * from "./types";
