'use client';
import { useEffect, useState } from 'react';
import * as braze from "@braze/web-sdk";
import Image from 'next/image';


export default function Home() {
  const [cards, setCards] = useState<any>([]);
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      window.addEventListener("load", function () {
        navigator.serviceWorker.register("/service-worker.js')").then(
          (registration) => {
            console.log("registration successfull", registration);
          },
          (error) => {
            // eslint-disable-next-line no-console
            console.log("Service Worker registration failed: ", error);
          }
        );
      });
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined' && typeof window.navigator !== 'undefined') {
      braze.initialize('<BRAZE_KEY>', {
        baseUrl: "sdk.iad-05.braze.com",
        enableLogging: true
      });
      braze.changeUser('kiranUser12@gmail.com');
      braze.requestPushPermission();

    }
   
  },[])
  useEffect(() => {
    if (typeof window !== 'undefined' && typeof window.navigator !== 'undefined') {
      braze.subscribeToContentCardsUpdates(function (event) {
        console.log("reached", event)
        setCards(event);
      });
      braze.requestContentCardsRefresh();
  
      braze.subscribeToInAppMessage(function (inAppMessage) {
        if (inAppMessage instanceof braze.InAppMessage) {
          if (inAppMessage.isControl) {
            braze.logInAppMessageImpression(inAppMessage);
          }
          else {
            const extras = inAppMessage.extras;
            if (extras) {
              for (const key in extras) {
                if (key === 'display' && extras[key] === 'homepage') {
                  braze.showInAppMessage(inAppMessage);
                }
              }
            }
          }
        }
      });
  
      // if (braze.isPushPermissionGranted() === false && braze.isPushBlocked() === false) {
      //   setIsPushPromptEligible(true);
      // }
  
      braze.openSession();
    }
    
  }, [setCards]);

  console.log("ss", )
  
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <>
      {
        cards?.cards?.length > 0 ? cards.cards.map((item : any) => {return(
          <Image
                src={item.imageUrl}
                width={500}
                height={500}
                alt="Picture of the author"
                key={item.id}
              />
            )}) : "no content cards"
      }
      </>
      
    </main>
  )
}
