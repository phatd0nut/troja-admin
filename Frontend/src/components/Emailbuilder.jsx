import React, { useEffect, useRef, useState, forwardRef, useImperativeHandle } from "react";
import BeefreeSDK from "@beefree.io/sdk";

// Hämta miljövariabler från .env-filen
const clientId = import.meta.env.VITE_CLIENT_ID;
const clientSecret = import.meta.env.VITE_CLIENT_SECRET;

/**
 * @component EmailBuilder
 * @description EmailBuilder-komponenten använder BeefreeSDK för att skapa och hantera e-postmallar.
 * 
 * @param {Object} props - Egenskaper som skickas till komponenten.
 * @param {Function} props.sendEmail - Funktion för att skicka e-post med HTML-innehåll.
 * @param {React.Ref} ref - Referens för att exponera interna metoder.
 * 
 * @method loadTemplate - Laddar en e-postmall från en JSON-fil.
 * @param {Object} jsonFile - JSON-objekt som representerar e-postmallen.
 * 
 * @method sendEmail - Skickar e-post och returnerar en Promise med HTML-innehållet.
 * @returns {Promise<string>} - En Promise som löser sig med HTML-innehållet av e-posten.
 * 
 * @function saveTemplateLocally - Sparar en e-postmall lokalt som en JSON-fil.
 * @param {Object} jsonFile - JSON-objekt som representerar e-postmallen.
 * 
 * @example
 * // Exempel på hur man använder EmailBuilder-komponenten
 * const emailBuilderRef = useRef();
 * 
 * const sendEmail = (htmlFile) => {
 *   // Logik för att skicka e-post
 * };
 * 
 * <EmailBuilder ref={emailBuilderRef} sendEmail={sendEmail} />
 * 
 * // Ladda en mall
 * emailBuilderRef.current.loadTemplate(jsonFile);
 * 
 * // Skicka e-post
 * emailBuilderRef.current.sendEmail().then((htmlFile) => {
 *   console.log("E-post skickad med innehåll:", htmlFile);
 * });
 */
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