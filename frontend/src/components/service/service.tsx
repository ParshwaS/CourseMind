"use client";
import React from 'react'
import { useEffect } from 'react'

function ServiceWorker() {
    useEffect(() => {
      if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
          navigator.serviceWorker.register('/service-worker.js').then((registration) => {
            console.log('SW registered: ', registration)
          });
        })
      }
    }, [])
    return (
        <></>
    )
}

export default ServiceWorker