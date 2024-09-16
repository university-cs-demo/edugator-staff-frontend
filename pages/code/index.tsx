import PlaygroundLayout from "components/PlaygroundLayout/PlaygroundLayout";
import { ReactNode } from "react";
import { Container, Typography, Grow } from "@mui/material";
import Lottie from "lottie-react";
import CrocodileOnAScooter from "public/crocodileonascooter.json";
import React, { useState } from 'react';

export default function CodePage() {
  return (
    <div className="flex items-center justify-center w-full flex-col h-full bg-slate-50 dark:bg-nav-darkest" role="main">
      <Lottie
        animationData={CrocodileOnAScooter}
        style={{
          width: 400,
        }}
      />
      <h1 className="text-3xl font-dm font-semibold mb-4 text-slate-900 dark:text-slate-200">
        Welcome to Edugator!
      </h1>
      <p className="text-slate-900 dark:text-slate-300">
        Select an exercise to get started.
      </p>
      <a href="https://edugator-tailwind.vercel.app/code/61dc5d16fd23ac28594f53ae" //Must change link after deployment
      className="transition -top-5 bg-primary text-primary-content absolute p-3 m-3 -translate-y-16 focus:translate-y-0" 
      > Or click here to get started!
      </a>
    </div>
  );
}

CodePage.getLayout = function getLayout(page: ReactNode) {
  return <PlaygroundLayout>{page}</PlaygroundLayout>;
};


