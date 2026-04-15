module.exports = {
  default: {
   // paths: ["playwright/features/**/*.feature"],

    require: [
      "playwright/steps/**/*.ts",  
      "playwright/hooks/**/*.ts"
    ],

    requireModule: ["ts-node/register"],  

    format: ["progress"]
  }
};