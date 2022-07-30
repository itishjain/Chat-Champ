import React, { useState } from "react";
import firebase from "firebase/app";
import { Alert, Button, Icon, Tag } from "rsuite";
import { auth } from "../../misc/firebase";

const ProviderBlock = () => {
  const [isConnnected, setIsConnected] = useState({
    "google.com": auth.currentUser.providerData.some(
      (data) => data.providerId === "google.com"
    ),
    "facebook.com": auth.currentUser.providerData.some(
      (data) => data.providerId === "facebook.com"
    ),
  });

  const updateIsConnected = (providerId, value) => {
    setIsConnected((p) => {
      return {
        ...p,
        [providerId]: value,
      };
    });
  };

  const unlink = async (providerId) => {
    try {
      if (auth.currentUser.providerData.length === 1) {
        throw new Error(`You can not disconnect from ${providerId}`);
      }

      await auth.currentUser.unlink(providerId);

      updateIsConnected(providerId, false);

      Alert.warning(`Disconnected from ${providerId}`, 4000);
    } catch (err) {
      Alert.error(err.message, 4000);
    }
  };

  const unlinkFacebook = () => {
    unlink("facebook.com");
  };
  const unlinkGoogle = () => {
    unlink("google.com");
  };

  const link = async (provider) => {
    try {
      await auth.currentUser.linkWithPopup(provider);
      Alert.success(`Signed in with ${provider.providerId}`, 4000);

      updateIsConnected(provider.providerId, true);
    } catch (err) {
      Alert.error(err.message, 4000);
    }
  };

  const linkFacebook = () => {
    link(new firebase.auth.FacebookAuthProvider());
  };
  const linkGoogle = () => {
    link(new firebase.auth.GoogleAuthProvider());
  };

  return (
    <div className="mt-2">
      {isConnnected["google.com"] && (
        <Tag color="green" closable onClose={unlinkGoogle}>
          <Icon icon="google">
            <span className="ml-1">Connected</span>
          </Icon>
        </Tag>
      )}
      {isConnnected["facebook.com"] && (
        <Tag color="blue" closable onClose={unlinkFacebook}>
          <Icon icon="facebook" />
          <span className="ml-1">Connected</span>
        </Tag>
      )}
      <div className="mt-2">
        {!isConnnected["google.com"] && (
          <Button block color="green" onClick={linkGoogle}>
            <Icon icon="google" />
            <span className="ml-1">Sign in with Google</span>
          </Button>
        )}
        {!isConnnected["facebook.com"] && (
          <Button block color="blue" onClick={linkFacebook}>
            <Icon icon="facebook" />
            <span className="ml-1">Sign in with Facebook</span>
          </Button>
        )}
      </div>
    </div>
  );
};

export default ProviderBlock;
