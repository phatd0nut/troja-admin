import React, { useEffect, useRef, useState, forwardRef, useImperativeHandle } from "react";
import BeefreeSDK from "@beefree.io/sdk";

// Hämta miljövariabler från .env-filen
const clientId = import.meta.env.VITE_CLIENT_ID;
const clientSecret = import.meta.env.VITE_CLIENT_SECRET;

const EmailBuilder = forwardRef((props, ref) => {
  const editorRef = useRef(null);
  const [bee, setBee] = useState(null);

  useImperativeHandle(ref, () => ({
    loadTemplate: (jsonFile) => {
      if (bee) {
        bee.load(jsonFile);
      }
    },
    sendEmail: async () => {
      if (bee) {
        return new Promise((resolve, reject) => {
          bee.send({}, (htmlFile) => {
            props.sendEmail(htmlFile); // Anropa sendEmail-funktionen från props
            resolve(htmlFile);
          });
        });
      }
    }
  }));

  useEffect(() => {
    const initBee = async () => {
      try {
        const beeInstance = new BeefreeSDK();
        await beeInstance.getToken(clientId, clientSecret);

        const beeConfig = {
          uid: "TrojaAdmin",
          container: "beeEditor",
          language: "sv-SE",
          onSave: (jsonFile) => {
            saveTemplateLocally(jsonFile); // Spara endast JSON-filen lokalt
          },
          onSend: async (htmlFile) => {
            props.sendEmail(htmlFile); // Skicka endast HTML-filen
          },
        };

        const template = {};

        beeInstance.start(beeConfig, template);
        setBee(beeInstance);
      } catch (error) {
        console.error("Error initializing BeeFree:", error);
      }
    };

    initBee();

    return () => {
      if (bee) {
        bee.destroy();
      }
    };
  }, []);

  const saveTemplateLocally = async (jsonFile) => {
    const blob = new Blob([JSON.stringify(jsonFile)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "template.json";
    a.click();
    URL.revokeObjectURL(url);
    alert("Template saved locally!");
  };

  return <div id="beeEditor" ref={editorRef}></div>;
});

export default EmailBuilder;