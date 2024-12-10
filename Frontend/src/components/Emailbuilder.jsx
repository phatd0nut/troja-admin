import React, { useEffect, useRef, useState } from 'react';
import BeefreeSDK from '@beefree.io/sdk';

// Hämta miljövariabler från .env-filen
const clientId = import.meta.env.VITE_CLIENT_ID;
const clientSecret = import.meta.env.VITE_CLIENT_SECRET;

const EmailBuilder = () => {
  const editorRef = useRef(null);
  const [bee, setBee] = useState(null);

  useEffect(() => {
    const initBee = async () => {
      try {
        const beeInstance = new BeefreeSDK();
        await beeInstance.getToken(clientId, clientSecret);

        const beeConfig = {
          uid: 'TrojaAdmin', // Ersätt med ditt faktiska uid
          container: editorRef.current.id, // Använd id istället för direkt referens
          language: 'sv-SE',
          onSave: (jsonFile, htmlFile) => {
            console.log('JSON File:', jsonFile);
            console.log('HTML File:', htmlFile);
          },
        };

        const template = {}; // Lägg till din mall här

        beeInstance.start(beeConfig, template);
        setBee(beeInstance);
      } catch (error) {
        console.error('Error initializing BeeFree:', error);
      }
    };

    initBee();

    return () => {
      if (bee) {
        bee.destroy();
      }
    };
  }, []);

  const startBee = () => {
    if (bee) {
      const template = {}; // Lägg till din mall här
      bee.start(template);
    }
  };

  return (
    <div>
      <div id="beeEditor" ref={editorRef}></div>
      <button onClick={startBee}>Start Email Editor</button>
      <button onClick={() => bee && bee.save()}>Save Email</button>
    </div>
  );
};

export default EmailBuilder;