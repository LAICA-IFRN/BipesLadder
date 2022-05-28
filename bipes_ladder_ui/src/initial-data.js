import { COMPONENT, ROW, COLUMN } from "./constants";
import React from "react";
import { nanoid } from "nanoid";

const initialData = {
  layout: [{
    type: ROW,
    id: "row0",
    children: [{
      type: COLUMN,
      id: nanoid(),
      children: [{
        type: COMPONENT,
        id: "openedContactComponent",

        column: "0",
        row: "0"


      }]
    },
    {
      type: COLUMN,
      id: nanoid(),
      children: [{
        type: COMPONENT,
        id: "lineComponent"
      }]
    },
    {
      type: COLUMN,
      id: nanoid(),
      children: [{
        type: COMPONENT,
        id: "lineComponent"
      }]
    },
    {
      type: COLUMN,
      id: nanoid(),
      children: [{
        type: COMPONENT,
        id: "lineComponent"
      }]
    },
    {
      type: COLUMN,
      id: nanoid(),
      children: [{
        type: COMPONENT,
        id: "lineComponent"
      }]
    },
    {
      type: COLUMN,
      id: nanoid(),
      children: [{
        type: COMPONENT,
        id: "lineComponent"
      }]
    },
    {
      type: COLUMN,
      id: "column6",
      children: [{
        type: COMPONENT,
        id: "lineComponent"
      }]
    },
    {
      type: COLUMN,
      id: nanoid(),
      children: [{
        type: COMPONENT,
        id: "lineComponent"
      }]
    },
    {
      type: COLUMN,
      id: nanoid(),
      children: [{
        type: COMPONENT,
        id: "lineComponent"
      }]
    },
    {
      type: COLUMN,
      id: nanoid(),
      children: [{
        type: COMPONENT,
        id: "lineComponent"
      }]
    },
    {
      type: COLUMN,
      id: nanoid(),
      children: [{
        type: COMPONENT,
        id: "lineComponent"
      }]
    },
    {
      type: COLUMN,
      id: nanoid(),
      children: [{
        type: COMPONENT,
        id: "lineComponent"
      }]
    },
    {
      type: COLUMN,
      id: nanoid(),
      children: [{
        type: COMPONENT,
        id: "lineComponent"
      }]
    },


    {
      type: COLUMN,
      id: nanoid(),
      children: [{
        type: COMPONENT,
        id: "coilComponent",

        row: "0"
      }]
    }
    ]
  },


  ],
  components: {
    openedContactComponent: { id: "openedContactComponent", type: "I0.X", content: "opened_contact", properties: { address: "" }, svg: { id: "opened_contact", style: "", path: ['M0 30 L40 30 L40 -100 L40 100', 'M80 30 L80 -100 L80 100 L80 30 L120 30'] }, color: 'black', column: "0", row: "0" },
    closedContactComponent: { id: "closedContactComponent", type: "I0.X", content: "closed_contact", properties: { address: "" }, svg: { id: "closed_contact", style: "", path: ['M0 30 L40 30 L40 -100 L40 100', 'M0 -100 L90 100', 'M80 30 L80 -100 L80 100 L80 30 L120 30'] }, color: 'black' },
    lineComponent: { id: "lineComponent", type: "", content: "line", properties: { address: "" }, svg: { id: "", style: "", path: ['M0 30 L120 30'] }, color: 'red' },
    timerComponent: { id: "timerComponent", type: "T0.X", content: "timer", properties: { address: "", timerType: "", timerDuration: "", baseTime: "", redentiveTimer: "", svgText: "" }, svg: { id: "", style: "", path: ['M0 30 L30 30 L30 60 L90 60 L90 0 L30 0 L30 30 M90 30 L120 30 M60 25v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'], text: "" }, color: "black" },
    counterComponent: { id: "counterComponent", type: "C0.X", content: "counter", properties: { address: "", counterType: "", preValue: "", svgText: "" }, svg: { id: "", style: "", path: ['M0 30 L30 30 L30 60 L90 60 L90 0 L30 0 L30 30 M90 30 L120 30'], text: "" }, color: "black" },
    coilComponent: { id: "coilComponent", type: "O0.X", content: "coil", properties: { address: "" }, svg: { id: "", style: "", path: ['M0 30 L40 30 L40 50 L80 50 L80 10 L40 10 L40 30 M80 30 L120 30'] }, color: 'black', row: "0" }
  }
};

export default initialData;
