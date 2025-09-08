#!/bin/bash
cd /home/kavia/workspace/code-generation/gadget-store-18602/gadget_react_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

