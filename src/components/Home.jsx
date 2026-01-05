import LoginModal, { generateAuthToken } from "./LoginModal";
import ProfileDropdown from "./ProfileDropdown";

import { useRef, useState, useEffect, useEffectEvent } from "react";

import {
  // import models
  // round
  round250,
  round500,

  // round square
  rs300,
  rs500,
  rs750,
  rs1000,

  // sweet box
  sb250,
  sb500,
  sb1000,

  // sweet box (5)
  sb_5_250,
  sb_5_500,
  digitalCatalogueImage,
  mainLogo,
  round100img,
  round250img,
  round500img,
  round750img,
  round1000img,
  defaultLogo1,
  modelIcon,
  downArrowIcon,
  upArrowIcon,
  uploadDesign,
  chooseType,
  imageIcon,
  upArrowUploadIcon,
  roundContainer120ml,
  roundContainer120,
  imlImageSmpl,
  pattern1Image,

  // category images
  roundImg,
  roundSquareImg,
  sweetBoxImg,
  sweetBox5Img,

  // product inner images
  // round containers
  round250mlImage,
  round500mlImage,
  // round squares
  rs300mlImage,
  rs500mlImage,
  rs750mlImage,
  rs1000mlImage,
  // sweet box
  sb250gImage,
  sb500gImage,
  sb1000gImage,
  // sweet box 5
  sb5_250gImage,
  sb5_500gImage,

  // Pattern images
  // round pattern
  round_250_1,
  round_250_2,
  round_500_1,
  // round square
  rs_300_1,
  rs_300_2,
  rs_500_1,
  rs_750_1,
  rs_750_2,
  rs_1000_1,
  // sweet box
  sb_250_1,
  sb_500_1,
  sb_1000_1,
  // sweet box 5
  sb_250_5_1,
  sb_250_5_2,
  sb_500_5_1,
  sb_500_5_2,
} from "../constants/assets";

import jsPDF from "jspdf";
import { modelScale } from "three/tsl";

export default function ModelViewer() {
  const modelRef = useRef(null);
  const [labelUrl, setLabelUrl] = useState("");
  const [topColor, setTopColor] = useState("#ffffff");
  const [bottomColor, setBottomColor] = useState("#ffffff");
  const [modelLoaded, setModelLoaded] = useState(false);
  const [selectedModel, setSelectedModel] = useState(round250);
  const [bgColor, setBgColor] = useState("#e5e7eb");
  const [displayModel, setDisplayModel] = useState(round250);
  const [currentView, setCurrentView] = useState("home");
  const [customLabelTexture, setCustomLabelTexture] = useState(null);
  const [openCategory, setOpenCategory] = useState(null);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [modelScaleValue, setModelScaleValue] = useState(0.65);

  const [activePart, setActivePart] = useState("lid"); // "lid" | "tub"

  // one of: "white" | "black" | "transparent" | "custom"
  // const [colorMode, setColorMode] = useState("white");
  const [lidColorMode, setLidColorMode] = useState(""); // empty = no selection
  const [tubColorMode, setTubColorMode] = useState(""); // empty = no selection

  const fileInputRef = useRef(null);
  const lidFileInputRef = useRef(null); // NEW
  const tubFileInputRef = useRef(null); // NEW

  // login modal
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const [pendingAction, setPendingAction] = useState(null);


  const modelMap = {
    [round250]: { withLogo: round250, withoutLogo: round250 },
    [round500]: { withLogo: round500, withoutLogo: round500 },
  };

  const defaultLogos = [
    { id: 1, name: "Logo 1", src: defaultLogo1 },
    { id: 2, name: "Logo 2", src: defaultLogo1 },
    { id: 3, name: "Logo 3", src: defaultLogo1 },
    { id: 4, name: "Logo 4", src: defaultLogo1 },
  ];



// Add this with your other useState declarations
const [viewMode, setViewMode] = useState("iml"); // "plain" | "iml"



  
  const getCurrentModel = () => {
    const mapping = modelMap[selectedModel];
    if (!mapping) return selectedModel;
    return customLabelTexture ? mapping.withoutLogo : mapping.withLogo;
  };

  useEffect(() => {
    const newModel = getCurrentModel();
    setDisplayModel(newModel);
    setModelLoaded(false);
  }, [selectedModel, customLabelTexture]);

  // STEP 2: Updated categories array with image property
  // const categories = [
  //   {
  //     id: "round",
  //     title: "Round Container",
  //     image: roundImg,

  //     items: [
  //       {
  //         id: "250ml",
  //         label: "250 ml Round Container",
  //         display: `<strong>250 ml</strong> Round Container`,
  //         path: round250,
  //         image: round250mlImage,
  //         dimensions: "4134px X 2480px (W x H)",
  //         pattern1: round_250_1,
  //         pattern2: round_250_2, 
  //         pattern3: round_250_1,
  //         pattern4: round_250_2, 
  //         pattern5: round_250_1,
  //         pattern6: round_250_2, 
  //         pattern7: round_250_1,
  //         pattern8: round_250_2, 
  //         pattern9: round_250_1,
  //         pattern10: round_250_2, 
          
  //         modelScale: 0.65,
  //       },

  //       {
  //         id: "500ml",
  //         label: "500 ml Round Container",
  //         display: `<strong>500 ml</strong> Round Container`,
  //         path: round500,
  //         image: round500mlImage,
  //         dimensions: "2481px X 1055px (W x H)",
  //         pattern1: round_500_1,
  //         pattern2: round_500_1,
  //         pattern3: round_500_1,
  //         pattern4: round_500_1,
  //         pattern5: round_500_1,
  //         pattern6: round_500_1,
  //         pattern7: round_500_1,
  //         pattern8: round_500_1,
  //         pattern9: round_500_1,
  //         pattern10: round_500_1,
  //         modelScale: 0.65,
  //       },
  //     ],
  //   },
  //   {
  //     id: "round_bevel",
  //     title: "Round Square",
  //     image: roundSquareImg,

  //     items: [
  //       {
  //         id: "300ml_rb",
  //         label: "300 ml",
  //         display: `<strong>300 ml</strong> Round Sqaure`,
  //         path: rs300,
  //         image: rs300mlImage,
  //         dimensions: "3865px X 851px (W x H)",
  //         pattern1: rs_300_1,
  //         pattern2: rs_300_2,
  //         modelScale: 0.65,
  //       },
  //       {
  //         id: "500ml_rb",
  //         label: "500 ml",
  //         display: `<strong>500 ml</strong> Round Sqaure`,
  //         path: rs500,
  //         image: rs500mlImage,
  //         dimensions: "3862px X 1183px (W x H)",
  //         pattern1: rs_500_1,
  //         pattern2: rs_500_1,
  //         modelScale: 0.65,
  //       },
  //       {
  //         id: "750ml_rb",
  //         label: "750 ml",
  //         display: `<strong>750 ml</strong> Round Sqaure`,
  //         path: rs750,
  //         image: rs750mlImage,
  //         dimensions: "3865px X 766px (W x H)",
  //         pattern1: rs_750_1,
  //         pattern2: rs_750_2,
  //         modelScale: 0.8,
  //       },
  //       {
  //         id: "1000ml_rb",
  //         label: "1000 ml",
  //         display: `<strong>1000 ml</strong> Round Sqaure`,
  //         path: rs1000,
  //         image: rs1000mlImage,
  //         dimensions: "3862px X 1183px (W x H)",
  //         pattern1: rs_1000_1,
  //         pattern2: rs_1000_1,
  //         modelScale: 0.75,
  //       },
  //     ],
  //   },

  //   {
  //     id: "taper_evident",
  //     title: "Sweet Box",
  //     image: sweetBoxImg,

  //     items: [
  //       {
  //         id: "250ml_te",
  //         label: "250 ml",
  //         display: `<strong>250 ml</strong> Sweet Box`,
  //         path: sb250,
  //         image: sb250gImage,
  //         dimensions: "2809px X 448px (W x H)",
  //         pattern1: sb_250_1,
  //         pattern2: sb_250_1,
  //         modelScale: 0.65,
  //       },
  //       {
  //         id: "500ml_te",
  //         label: "500 ml",
  //         display: `<strong>500 ml</strong> Sweet Box`,
  //         path: sb500,
  //         image: sb500gImage,
  //         dimensions: "2809px X 448px (W x H)",
  //         pattern1: sb_500_1,
  //         pattern2: sb_500_1,
  //         modelScale: 0.65,
  //       },
  //       {
  //         id: "1000ml_te",
  //         label: "1000 ml",
  //         display: `<strong>1000 ml</strong> Sweet Box`,
  //         path: sb1000,
  //         image: sb1000gImage,
  //         dimensions: "2809px X 448px (W x H)",
  //         pattern1: sb_1000_1,
  //         pattern2: sb_1000_1,
  //         modelScale: 0.65,
  //       },
  //     ],
  //   },
  //   {
  //     id: "sweet_box",
  //     title: "Sweet Box (5)",
  //     image: sweetBox5Img,

  //     items: [
  //       {
  //         id: "250_tr",
  //         label: "250 gms",
  //         display: `<strong>250 gms</strong> Sweet Box (5)`,
  //         path: sb_5_250,
  //         image: sb5_250gImage,
  //         dimensions_lid: "1512px X 1152px (W x H)",
  //         dimensions_tub: "2402px X 2048px (W x H)",
  //         pattern1_1: sb_250_5_1,
  //         pattern1_2: sb_250_5_2,
  //         pattern2_1: sb_250_5_1,
  //         pattern2_2: sb_250_5_2,
  //         modelScale: 0.65,
  //       },
  //       {
  //         id: "250_premium",
  //         label: "500 gms",
  //         display: `<strong>500 gms</strong> Sweet Box (5)`,
  //         path: sb_5_500,
  //         image: sb5_500gImage,
  //         dimensions_lid: "1630px X 1288px (W x H)",
  //         dimensions_tub: "2398px X 2045px (W x H)",
  //         pattern1_1: sb_500_5_1,
  //         pattern1_2: sb_500_5_2,
  //         pattern2_1: sb_500_5_1,
  //         pattern2_2: sb_500_5_2,
  //         modelScale: 0.8,
  //       },
  //     ],
  //   },
  // ];

  // Add these new state variables after existing useState declarations
const [selectedPattern, setSelectedPattern] = useState(1); // For non-SB5 products
const [selectedLidPattern, setSelectedLidPattern] = useState(1); // For SB5 lid
const [selectedTubPattern, setSelectedTubPattern] = useState(1); // For SB5 tub

// Updated categories array with 10 patterns for ALL products
// Updated categories array with 10 patterns for ALL products
const categories = [
  {
    id: "round",
    title: "Round Container",
    image: roundImg,
    items: [
      {
        id: "250ml",
        label: "250 ml Round Container",
        display: `<strong>250 ml</strong> Round Container`,
        path: round250,
        image: round250mlImage,
        dimensions: "4134px X 2480px (W x H)",
        patterns: [
          round_250_1,
          round_250_2,
          round_250_1,
          round_250_2,
          round_250_1,
          round_250_2,
          round_250_1,
          round_250_2,
          round_250_1,
          round_250_2,
        ],
        modelScale: 0.65,
      },
      {
        id: "500ml",
        label: "500 ml Round Container",
        display: `<strong>500 ml</strong> Round Container`,
        path: round500,
        image: round500mlImage,
        dimensions: "2481px X 1055px (W x H)",
        patterns: [
          round_500_1,
          round_500_1,
          round_500_1,
          round_500_1,
          round_500_1,
          round_500_1,
          round_500_1,
          round_500_1,
          round_500_1,
          round_500_1,
        ],
        modelScale: 0.65,
      },
    ],
  },
  {
    id: "round_bevel",
    title: "Round Square",
    image: roundSquareImg,
    items: [
      {
        id: "300ml_rb",
        label: "300 ml",
        display: `<strong>300 ml</strong> Round Square`,
        path: rs300,
        image: rs300mlImage,
        dimensions: "3865px X 851px (W x H)",
        patterns: [
          rs_300_1,
          rs_300_2,
          rs_300_1,
          rs_300_2,
          rs_300_1,
          rs_300_2,
          rs_300_1,
          rs_300_2,
          rs_300_1,
          rs_300_2,
        ],
        modelScale: 0.65,
      },
      {
        id: "500ml_rb",
        label: "500 ml",
        display: `<strong>500 ml</strong> Round Square`,
        path: rs500,
        image: rs500mlImage,
        dimensions: "3862px X 1183px (W x H)",
        patterns: [
          rs_500_1,
          rs_500_1,
          rs_500_1,
          rs_500_1,
          rs_500_1,
          rs_500_1,
          rs_500_1,
          rs_500_1,
          rs_500_1,
          rs_500_1,
        ],
        modelScale: 0.65,
      },
      {
        id: "750ml_rb",
        label: "750 ml",
        display: `<strong>750 ml</strong> Round Square`,
        path: rs750,
        image: rs750mlImage,
        dimensions: "3865px X 766px (W x H)",
        patterns: [
          rs_750_1,
          rs_750_2,
          rs_750_1,
          rs_750_2,
          rs_750_1,
          rs_750_2,
          rs_750_1,
          rs_750_2,
          rs_750_1,
          rs_750_2,
        ],
        modelScale: 0.8,
      },
      {
        id: "1000ml_rb",
        label: "1000 ml",
        display: `<strong>1000 ml</strong> Round Square`,
        path: rs1000,
        image: rs1000mlImage,
        dimensions: "3862px X 1183px (W x H)",
        patterns: [
          rs_1000_1,
          rs_1000_1,
          rs_1000_1,
          rs_1000_1,
          rs_1000_1,
          rs_1000_1,
          rs_1000_1,
          rs_1000_1,
          rs_1000_1,
          rs_1000_1,
        ],
        modelScale: 0.75,
      },
    ],
  },
  {
    id: "taper_evident",
    title: "Sweet Box",
    image: sweetBoxImg,
    items: [
      {
        id: "250ml_te",
        label: "250 ml",
        display: `<strong>250 ml</strong> Sweet Box`,
        path: sb250,
        image: sb250gImage,
        dimensions: "2809px X 448px (W x H)",
        patterns: [
          sb_250_1,
          sb_250_1,
          sb_250_1,
          sb_250_1,
          sb_250_1,
          sb_250_1,
          sb_250_1,
          sb_250_1,
          sb_250_1,
          sb_250_1,
        ],
        modelScale: 0.65,
      },
      {
        id: "500ml_te",
        label: "500 ml",
        display: `<strong>500 ml</strong> Sweet Box`,
        path: sb500,
        image: sb500gImage,
        dimensions: "2809px X 448px (W x H)",
        patterns: [
          sb_500_1,
          sb_500_1,
          sb_500_1,
          sb_500_1,
          sb_500_1,
          sb_500_1,
          sb_500_1,
          sb_500_1,
          sb_500_1,
          sb_500_1,
        ],
        modelScale: 0.65,
      },
      {
        id: "1000ml_te",
        label: "1000 ml",
        display: `<strong>1000 ml</strong> Sweet Box`,
        path: sb1000,
        image: sb1000gImage,
        dimensions: "2809px X 448px (W x H)",
        patterns: [
          sb_1000_1,
          sb_1000_1,
          sb_1000_1,
          sb_1000_1,
          sb_1000_1,
          sb_1000_1,
          sb_1000_1,
          sb_1000_1,
          sb_1000_1,
          sb_1000_1,
        ],
        modelScale: 0.65,
      },
    ],
  },
  {
    id: "sweet_box",
    title: "Sweet Box (5)",
    image: sweetBox5Img,
    items: [
      {
        id: "250_tr",
        label: "250 gms",
        display: `<strong>250 gms</strong> Sweet Box (5)`,
        path: sb_5_250,
        image: sb5_250gImage,
        dimensions_lid: "1512px X 1152px (W x H)",
        dimensions_tub: "2402px X 2048px (W x H)",
        lidPatterns: [
          sb_250_5_1,
          sb_250_5_2,
          sb_250_5_1,
          sb_250_5_2,
          sb_250_5_1,
          sb_250_5_2,
          sb_250_5_1,
          sb_250_5_2,
          sb_250_5_1,
          sb_250_5_2,
        ],
        tubPatterns: [
          sb_250_5_1,
          sb_250_5_2,
          sb_250_5_1,
          sb_250_5_2,
          sb_250_5_1,
          sb_250_5_2,
          sb_250_5_1,
          sb_250_5_2,
          sb_250_5_1,
          sb_250_5_2,
        ],
        modelScale: 0.65,
      },
      {
        id: "250_premium",
        label: "500 gms",
        display: `<strong>500 gms</strong> Sweet Box (5)`,
        path: sb_5_500,
        image: sb5_500gImage,
        dimensions_lid: "1630px X 1288px (W x H)",
        dimensions_tub: "2398px X 2045px (W x H)",
        lidPatterns: [
          sb_500_5_1,
          sb_500_5_2,
          sb_500_5_1,
          sb_500_5_2,
          sb_500_5_1,
          sb_500_5_2,
          sb_500_5_1,
          sb_500_5_2,
          sb_500_5_1,
          sb_500_5_2,
        ],
        tubPatterns: [
          sb_500_5_1,
          sb_500_5_2,
          sb_500_5_1,
          sb_500_5_2,
          sb_500_5_1,
          sb_500_5_2,
          sb_500_5_1,
          sb_500_5_2,
          sb_500_5_1,
          sb_500_5_2,
        ],
        modelScale: 0.8,
      },
    ],
  },
];

// Update the setPatternModel function to accept pattern index
const setPatternModel = async (patternImage) => {
  if (!modelRef.current || !modelLoaded) return;
  const mv = modelRef.current;
  const model = mv.model;
  if (!model || !model.materials) return;
  const materials = model.materials;

  const labelMat = materials.find((m) =>
    m.name.toLowerCase().includes("texture_area")
  );

  if (!labelMat) {
    console.warn("⚠ No 'texture_area' material found for pattern");
    console.log(
      "Available materials:",
      materials.map((m) => m.name)
    );
    return;
  }

  console.log("Applying pattern:", patternImage);
  const tex = await mv.createTexture(patternImage);
  if (!tex) {
    console.error("Pattern texture creation failed");
    return;
  }

  labelMat.pbrMetallicRoughness.baseColorTexture.setTexture(tex);
  labelMat.pbrMetallicRoughness.setBaseColorFactor([1, 1, 1, 1]);
  labelMat.setAlphaMode("OPAQUE");
  labelMat.setAlphaCutoff(1);

  const underTextureName = "texture_under";
  const underMat = materials.find((m) => m.name === underTextureName);
  if (underMat) {
    underMat.pbrMetallicRoughness.baseColorTexture.setTexture(null);
    underMat.pbrMetallicRoughness.setBaseColorFactor([1, 1, 1, 1]);
    underMat.setAlphaMode("OPAQUE");
    underMat.setAlphaCutoff(1);
  }

  mv.requestUpdate();
};

// Update setPatternModelSB5 to accept separate lid and tub patterns
const setPatternModelSB5 = async (patternImage1, patternImage2) => {
  if (!modelRef.current || !modelLoaded) return;
  const mv = modelRef.current;
  const model = mv.model;
  if (!model || !model.materials) return;
  const materials = model.materials;

  const labelMat = materials.find((m) =>
    m.name.toLowerCase().includes("texture_area")
  );

  if (!labelMat) {
    console.warn("⚠ No 'texture_area' material found for pattern");
    console.log(
      "Available materials:",
      materials.map((m) => m.name)
    );
    return;
  }

  console.log("Applying lid pattern:", patternImage1);
  const tex = await mv.createTexture(patternImage1);
  if (!tex) {
    console.error("Pattern texture creation failed");
    return;
  }

  labelMat.pbrMetallicRoughness.baseColorTexture.setTexture(tex);
  labelMat.pbrMetallicRoughness.setBaseColorFactor([1, 1, 1, 1]);
  labelMat.setAlphaMode("OPAQUE");
  labelMat.setAlphaCutoff(1);

  const underTextureName = "texture_area2";
  const underMat = materials.find((m) => m.name === underTextureName);
  const tex2 = await mv.createTexture(patternImage2);
  if (underMat) {
    underMat.pbrMetallicRoughness.baseColorTexture.setTexture(tex2);
    underMat.pbrMetallicRoughness.setBaseColorFactor([1, 1, 1, 1]);
    underMat.setAlphaMode("OPAQUE");
    underMat.setAlphaCutoff(1);
  }

  mv.requestUpdate();
};

// Add useEffect to reset pattern selection when model changes
useEffect(() => {
  setSelectedPattern(1);
  setSelectedLidPattern(1);
  setSelectedTubPattern(1);
}, [selectedModel]);

// Update handleModelChange to reset patterns
const handleModelChange = (modelPath) => {
  setSelectedModel(modelPath);
  setModelLoaded(false);
  setSelectedPattern(1);
  setSelectedLidPattern(1);
  setSelectedTubPattern(1);
  
  const item = categories
    .flatMap((cat) => cat.items)
    .find((i) => i.path === modelPath);
  if (item?.modelScale) {
    setModelScaleValue(item.modelScale);
  }
};

// Add pattern selection handler for non-SB5 products
const handlePatternSelect = (patternIndex) => {
  setSelectedPattern(patternIndex);
  const item = getSelectedItem();
  if (item && item.patterns && item.patterns[patternIndex - 1]) {
    setPatternModel(item.patterns[patternIndex - 1]);
  }
};

// Add pattern selection handlers for SB5 products
const handleLidPatternSelect = (patternIndex) => {
  setSelectedLidPattern(patternIndex);
  const item = getSelectedItem();
  if (item && item.lidPatterns && item.tubPatterns) {
    const lidPattern = item.lidPatterns[patternIndex - 1];
    const tubPattern = item.tubPatterns[selectedTubPattern - 1];
    setPatternModelSB5(lidPattern, tubPattern);
  }
};

const handleTubPatternSelect = (patternIndex) => {
  setSelectedTubPattern(patternIndex);
  const item = getSelectedItem();
  if (item && item.lidPatterns && item.tubPatterns) {
    const lidPattern = item.lidPatterns[selectedLidPattern - 1];
    const tubPattern = item.tubPatterns[patternIndex - 1];
    setPatternModelSB5(lidPattern, tubPattern);
  }
};





// Add this function with your other pattern functions
const setPlainModel = () => {
  if (!modelRef.current || !modelLoaded) return;
  
  const mv = modelRef.current;
  const materials = mv.model?.materials;
  if (!materials) return;

  // Clear texture from texture_area (main label area)
  const labelMat = materials.find((m) =>
    m.name.toLowerCase().includes("texture_area") && !m.name.toLowerCase().includes("texture_area2")
  );

  if (labelMat) {
    labelMat.pbrMetallicRoughness.baseColorTexture.setTexture(null);
    labelMat.pbrMetallicRoughness.setBaseColorFactor([1, 1, 1, 0]); // Set opacity to 0
    labelMat.setAlphaMode("BLEND");
  }

  // Clear texture from texture_area2 (for Sweet Box 5 tub)
  const labelMat2 = materials.find((m) => m.name === "texture_area2");
  if (labelMat2) {
    labelMat2.pbrMetallicRoughness.baseColorTexture.setTexture(null);
    labelMat2.pbrMetallicRoughness.setBaseColorFactor([1, 1, 1, 0]); // Set opacity to 0
    labelMat2.setAlphaMode("BLEND");
  }

  // Clear texture_under if exists
  const underMat = materials.find((m) => m.name === "texture_under");
  if (underMat) {
    underMat.pbrMetallicRoughness.baseColorTexture.setTexture(null);
    underMat.pbrMetallicRoughness.setBaseColorFactor([1, 1, 1, 0]);
    underMat.setAlphaMode("BLEND");
  }

  mv.requestUpdate();
  console.log("✓ Plain mode activated - all textures removed");
};



// Add this function to restore IML view
const restoreIMLMode = () => {
  if (!modelRef.current || !modelLoaded) return;
  
  const item = getSelectedItem();
  if (!item) return;

  // Check if it's Sweet Box 5 (has separate lid/tub patterns)
  if (item.lidPatterns && item.tubPatterns) {
    const lidPattern = item.lidPatterns[selectedLidPattern - 1];
    const tubPattern = item.tubPatterns[selectedTubPattern - 1];
    if (lidPattern && tubPattern) {
      setPatternModelSB5(lidPattern, tubPattern);
    }
  } else if (item.patterns) {
    // Regular products with single pattern
    const pattern = item.patterns[selectedPattern - 1];
    if (pattern) {
      setPatternModel(pattern);
    }
  }

  console.log("✓ IML mode activated - patterns restored");
};

// Add this handler function
const handleViewModeChange = (mode) => {
  setViewMode(mode);
  
  if (mode === "plain") {
    setPlainModel();
  } else {
    restoreIMLMode();
  }
};



  const hexToRgba = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!result) return [1, 1, 1, 1];
    return [
      parseInt(result[1], 16) / 255,
      parseInt(result[2], 16) / 255,
      parseInt(result[3], 16) / 255,
      1.0,
    ];
  };

  const applyColorToMaterial = (material, hexColor) => {
    try {
      // const rgba = hexToRgba(hexColor);
      // rgba[3] = 1.0;

      // material.pbrMetallicRoughness.setBaseColorFactor(rgba);
      material.pbrMetallicRoughness.setMetallicFactor(0.0);
      material.pbrMetallicRoughness.setRoughnessFactor(0.5);
      material.pbrMetallicRoughness.setBaseColorFactor(hexColor);
      // Emissive color → always black (000000)
      material.setEmissiveFactor([0.0, 0.0, 0.0]);
      material.setEmissiveStrength(0.0); // ensure no glow
      // Opaque 100%
      material.opacity = 1.0;
      material.transparent = false;

      // console.log(`✓ Applied ${hexColor} (Solid/Shiny) to "${material.name}"`);
    } catch (error) {
      console.error(`Error applying color to ${material.name}:`, error);
    }
  };

  useEffect(() => {
    const mv = modelRef.current;
    if (!mv) return;

    const handleLoad = () => {
      console.log("Model loaded");
      setModelLoaded(true);

      const materials = mv.model?.materials;
      if (materials) {
        console.log(
          "Available materials:",
          materials.map((m) => m.name)
        );
        materials.forEach((m, i) => {
          console.log(`Material[${i}]: "${m.name}"`);
        });
      }
    };

    mv.addEventListener("load", handleLoad);
    return () => mv.removeEventListener("load", handleLoad);
  }, [displayModel]);

  // In the lid useEffect (around line with activePart === "lid"):
  useEffect(() => {
    if (!modelLoaded || !modelRef.current || activePart !== "lid" || !topColor)
      return;

    const materials = modelRef.current.model?.materials;
    if (!materials) return;

    materials.forEach((material) => {
      const name = material.name.toLowerCase();

      // only top materials
      if (!name.includes("lid")) return;

      // exclusions
      if (name.includes("logo")) return;
      if (name === "texturearea" && customLabelTexture) return;

      if (lidColorMode === "transparent") {
        setModelTransparent(material, true);
      } else {
        setModelTransparent(material, false);
        applyColorToMaterial(material, topColor);
      }
    });
  }, [topColor, activePart, modelLoaded, customLabelTexture, lidColorMode]);

  // In the tub useEffect:
  useEffect(() => {
    if (
      !modelLoaded ||
      !modelRef.current ||
      activePart !== "tub" ||
      !bottomColor
    )
      return;

    const materials = modelRef.current.model?.materials;
    if (!materials) return;

    materials.forEach((material) => {
      const name = material.name.toLowerCase();

      // only bottom materials
      if (!name.includes("bottom") && !name.includes("tub")) return;

      // exclusions
      if (name.includes("logo")) return;
      if (name === "texturearea" && customLabelTexture) return;

      if (tubColorMode === "transparent") {
        setModelTransparent(material, true);
      } else {
        setModelTransparent(material, false);
        applyColorToMaterial(material, bottomColor);
      }
    });
  }, [bottomColor, activePart, modelLoaded, customLabelTexture, tubColorMode]);

  function setModelTransparent(material, transparent) {
    const pbr = material.pbrMetallicRoughness;

    if (activePart === "lid" && !material.name.toLowerCase().includes("lid"))
      return;
    if (activePart === "tub" && !material.name.toLowerCase().includes("bottom"))
      return;

    try {
      if (transparent) {
        console.log(`Setting ${material.name} to TRANSPARENT`);
        // alpha < 1, keep color; metallic/roughness as you like
        const current = pbr.baseColorFactor; // [r,g,b,a]
        pbr.setBaseColorFactor([1, 1, 1, 0.36]);
        material.setAlphaMode("BLEND");
        pbr.setMetallicFactor(1); // or whatever you want visually
        pbr.setRoughnessFactor(0.12);
        material.setEmissiveFactor("#888888");
      } else {
        console.log(`Setting ${material.name} to OPAQUE`);
        const current = pbr.baseColorFactor;
        pbr.setBaseColorFactor([current[0], current[1], current[2], 1.0]);
        material.setAlphaMode("OPAQUE");
        // restore your default metal/rough values here
        pbr.setMetallicFactor(0);
        pbr.setRoughnessFactor(0.5);
        material.setEmissiveFactor([0, 0, 0]);
      }
    } catch (error) {
      console.error(`Error setting transparency for ${material.name}:`, error);
    }
  }

  useEffect(() => {
    if (!customLabelTexture || !modelLoaded || !modelRef.current) return;

    const mv = modelRef.current;

    (async () => {
      try {
        console.log("Applying custom label texture...");
        const texture = await mv.createTexture(customLabelTexture);
        const targetMat = mv.model?.materials.find(
          (m) => m.name === "texture_area"
        );

        if (targetMat) {
          targetMat.pbrMetallicRoughness.setBaseColorFactor([1, 1, 1, 1]);
          targetMat.pbrMetallicRoughness.baseColorTexture.setTexture(texture);
          targetMat.pbrMetallicRoughness.setMetallicFactor(0.0);
          targetMat.pbrMetallicRoughness.setRoughnessFactor(0.5);

          console.log("✓ Custom label texture applied to texture_area");
        }
      } catch (e) {
        console.error("Error applying custom label texture:", e);
      }
    })();
  }, [customLabelTexture, modelLoaded]);

  useEffect(() => {
    if (!labelUrl || !modelLoaded || !modelRef.current) return;

    const mv = modelRef.current;
    const materials = mv.model?.materials;

    (async () => {
      try {
        const texture = await mv.createTexture(labelUrl);
        if (!texture) {
          console.error("Texture creation failed");
          return;
        }

        const targetMaterial = materials.find(
          (mat) =>
            mat.name === "bottom_logo" ||
            mat.name === "bottomlogo" ||
            mat.name.toLowerCase().includes("logo")
        );

        if (!targetMaterial) {
          console.warn("Material logo not found in model");
          console.log(
            "Available materials:",
            materials.map((m) => m.name)
          );
          return;
        }

        console.log("Applying logo to", targetMaterial.name);
        targetMaterial.pbrMetallicRoughness.baseColorTexture.setTexture(
          texture
        );
        targetMaterial.pbrMetallicRoughness.setMetallicFactor(0.0);
        targetMaterial.pbrMetallicRoughness.setRoughnessFactor(0.0);

        console.log("Logo applied successfully!");
      } catch (err) {
        console.error("Error applying logo texture:", err);
      }
    })();
  }, [labelUrl, modelLoaded]);

  const handleLabelUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setLabelUrl(event.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleDefaultLogoSelect = (logoSrc) => {
    setLabelUrl(logoSrc);
  };

const handleExportGLB = async () => {
  checkLoginAndExecute(async () => {
    const mv = modelRef.current;
    if (!mv) return;
    const blob = await mv.exportScene();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    const modelName =
      categories
        .flatMap((cat) => cat.items)
        .find((m) => m.path === selectedModel)?.label || "model";
    a.download = `${modelName}.glb`;
    a.click();
    setShowExportMenu(false);
  });
};

const handleExportPDF = async () => {
    checkLoginAndExecute(async () => {
      try {
        const mv = modelRef.current;
        if (!mv) {
          console.error("Model viewer not available");
          alert("Model not ready. Please wait until the model loads.");
          return;
        }

        await new Promise((resolve) => setTimeout(resolve, 100));
        let dataUrl = null;

        if (typeof mv.toDataURL === "function") {
          dataUrl = await mv.toDataURL("image/png", 1.0);
        } else if (typeof mv.captureScreenshot === "function") {
          const blob = await mv.captureScreenshot();
          dataUrl = await new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.readAsDataURL(blob);
          });
        } else {
          const canvas = mv.shadowRoot?.querySelector("canvas");
          if (canvas) {
            dataUrl = canvas.toDataURL("image/png");
          } else {
            throw new Error("Cannot find WebGL canvas to export");
          }
        }

        if (!dataUrl || !dataUrl.startsWith("data:")) {
          throw new Error("Failed to capture model screenshot");
        }

        const pdf = new jsPDF("l", "mm", "a4");
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();

        const img = new Image();
        img.src = dataUrl;

        await new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = reject;
        });

        const imgAspectRatio = img.width / img.height;
        const pdfAspectRatio = pdfWidth / pdfHeight;
        let finalWidth, finalHeight, xOffset, yOffset;

        if (imgAspectRatio > pdfAspectRatio) {
          finalWidth = pdfWidth;
          finalHeight = pdfWidth / imgAspectRatio;
          xOffset = 0;
          yOffset = (pdfHeight - finalHeight) / 2;
        } else {
          finalHeight = pdfHeight;
          finalWidth = pdfHeight * imgAspectRatio;
          yOffset = 0;
          xOffset = (pdfWidth - finalWidth) / 2;
        }

        pdf.addImage(dataUrl, "PNG", xOffset, yOffset, finalWidth, finalHeight);

        const modelName =
          categories
            .flatMap((cat) => cat.items)
            .find((m) => m.path === selectedModel)?.label || "model";

        pdf.save(`${modelName}.pdf`);
        setShowExportMenu(false);
        console.log("PDF exported successfully with correct aspect ratio!");
      } catch (err) {
        console.error("Error exporting PDF:", err);
        alert(
          `Failed to export PDF: ${err.message}. Try again after the model fully loads.`
        );
      }
    });
  };

  // const handleModelChange = (modelPath) => {
  //   setSelectedModel(modelPath);
  //   setModelLoaded(false);

  //   // Set scale immediately based on selected item
  //   const item = categories
  //     .flatMap((cat) => cat.items)
  //     .find((i) => i.path === modelPath);

  //   if (item?.modelScale) {
  //     setModelScaleValue(item.modelScale);
  //   }
  // };

  // set pattern to model
  // const setPatternModel = async (patternImage) => {
  //   if (!modelRef.current || !modelLoaded) return;

  //   const mv = modelRef.current;
  //   const model = mv.model;
  //   if (!model || !model.materials) return;

  //   const materials = model.materials;

  //   // 1. find label material (texture_area)
  //   const labelMat = materials.find((m) =>
  //     m.name.toLowerCase().includes("texture_area")
  //   );
  //   if (!labelMat) {
  //     console.warn("⚠ No 'texture_area' material found for pattern");
  //     console.log(
  //       "Available materials:",
  //       materials.map((m) => m.name)
  //     );
  //     return;
  //   }

  //   console.log("Applying pattern:", patternImage);

  //   // 2. create texture via model-viewer instance
  //   const tex = await mv.createTexture(patternImage);
  //   if (!tex) {
  //     console.error("Pattern texture creation failed");
  //     return;
  //   }

  //   // 3. apply to label material
  //   labelMat.pbrMetallicRoughness.baseColorTexture.setTexture(tex);
  //   labelMat.pbrMetallicRoughness.setBaseColorFactor([1, 1, 1, 1]);
  //   labelMat.setAlphaMode("OPAQUE");
  //   labelMat.setAlphaCutoff(1);

  //   // 4. optional: clear underTexture material
  //   const underTextureName = "texture_under";
  //   const underMat = materials.find((m) => m.name === underTextureName);

  //   if (underMat) {
  //     underMat.pbrMetallicRoughness.baseColorTexture.setTexture(null);
  //     underMat.pbrMetallicRoughness.setBaseColorFactor([1, 1, 1, 1]);
  //     underMat.setAlphaMode("OPAQUE");
  //     underMat.setAlphaCutoff(1);
  //   }

  //   // 5. force re-render
  //   mv.requestUpdate();
  // };

  // const setPatternModelSB5 = async (patternImage1, patternImage2) => {
  //   if (!modelRef.current || !modelLoaded) return;

  //   const mv = modelRef.current;
  //   const model = mv.model;
  //   if (!model || !model.materials) return;

  //   const materials = model.materials;

  //   // 1. find label material (texture_area)
  //   const labelMat = materials.find((m) =>
  //     m.name.toLowerCase().includes("texture_area")
  //   );
  //   if (!labelMat) {
  //     console.warn("⚠ No 'texture_area' material found for pattern");
  //     console.log(
  //       "Available materials:",
  //       materials.map((m) => m.name)
  //     );
  //     return;
  //   }

  //   console.log("Applying pattern:", patternImage1);

  //   // 2. create texture via model-viewer instance
  //   const tex = await mv.createTexture(patternImage1);
  //   if (!tex) {
  //     console.error("Pattern texture creation failed");
  //     return;
  //   }

  //   // 3. apply to label material
  //   labelMat.pbrMetallicRoughness.baseColorTexture.setTexture(tex);
  //   labelMat.pbrMetallicRoughness.setBaseColorFactor([1, 1, 1, 1]);
  //   labelMat.setAlphaMode("OPAQUE");
  //   labelMat.setAlphaCutoff(1);

  //   // 4. optional: clear underTexture material
  //   const underTextureName = "texture_area2";
  //   const underMat = materials.find((m) => m.name === underTextureName);
  //   const tex2 = await mv.createTexture(patternImage2);
  //   if (underMat) {
  //     underMat.pbrMetallicRoughness.baseColorTexture.setTexture(tex2);
  //     underMat.pbrMetallicRoughness.setBaseColorFactor([1, 1, 1, 1]);
  //     underMat.setAlphaMode("OPAQUE");
  //     underMat.setAlphaCutoff(1);
  //   }

  //   // 5. force re-render
  //   mv.requestUpdate();
  // };

  const handlePatternUploadClick = () => {
    checkLoginAndExecute(() => {
      if (fileInputRef.current) {
        fileInputRef.current.click();
      }
    });
  };

  const handlePatternFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target.result;
      // apply to model
      setPatternModel(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  // Separate upload handlers
  const handleLidUploadClick = () => {
    checkLoginAndExecute(() => {
      if (lidFileInputRef.current) {
        lidFileInputRef.current.click();
      }
    });
  };

  const handleTubUploadClick = () => {
    checkLoginAndExecute(() => {
      if (tubFileInputRef.current) {
        tubFileInputRef.current.click();
      }
    });
  };

  const applyTextureToMaterial = async ({
    event,
    materialName,
    modelRef,
    modelLoaded,
  }) => {
    const file = event.target.files?.[0];
    if (!file || !modelRef.current || !modelLoaded) return;

    const reader = new FileReader();

    reader.onload = async (e) => {
      const dataUrl = e.target.result;
      const mv = modelRef.current;
      const materials = mv.model?.materials;

      const material = materials?.find((m) => m.name === materialName);
      if (!material) {
        console.warn(`Material "${materialName}" not found`);
        return;
      }

      const texture = await mv.createTexture(dataUrl);
      if (!texture) {
        console.error(`Texture creation failed for ${materialName}`);
        return;
      }

      material.pbrMetallicRoughness.baseColorTexture.setTexture(texture);
      material.pbrMetallicRoughness.setBaseColorFactor([1, 1, 1, 1]);
      material.setAlphaMode("OPAQUE");
      material.setAlphaCutoff(1);

      mv.requestUpdate();
    };

    reader.readAsDataURL(file);
  };

  // Separate file change handlers
  const handleLidFileChange = (e) =>
    applyTextureToMaterial({
      event: e,
      materialName: "texture_area",
      modelRef,
      modelLoaded,
    });

  const handleTubFileChange = (e) =>
    applyTextureToMaterial({
      event: e,
      materialName: "texture_area2",
      modelRef,
      modelLoaded,
    });

  const getSelectedItem = () => {
    for (const cat of categories) {
      const found = cat.items.find((item) => item.path === selectedModel);
      if (found) return found;
    }
    return null;
  };

  // Add this new function
  const getModelCategory = () => {
    for (const cat of categories) {
      const found = cat.items.find((item) => item.path === selectedModel);
      if (found) return cat.id;
    }
    return null;
  };

  useEffect(() => {
    const categoryId = getModelCategory();

    // Reset both color modes when model changes
    setLidColorMode("");
    setTubColorMode("");

    if (categoryId === "round" || categoryId === "round_bevel") {
      // Round and Round Square models → transparent for both lid and tub
      const transparentColor = "rgba(255, 255, 255, 0)";
      setTopColor(transparentColor);
      setBottomColor("#ffffff");
      setLidColorMode("transparent");
      setTubColorMode("white");
    } else if (categoryId === "taper_evident" || categoryId === "sweet_box") {
      // Sweet Box and Sweet Box (5) models → white for both lid and tub
      setTopColor("#ffffff");
      setBottomColor("#ffffff");
      setLidColorMode("white");
      setTubColorMode("white");
    } else {
      // For any other category, set default to white
      setTopColor("#ffffff");
      setBottomColor("#ffffff");
      setLidColorMode("white");
      setTubColorMode("white");
    }
  }, [selectedModel]);

  const selectedItem = getSelectedItem();

  // Model zoom codes:
  const MIN_SCALE = 0.5;
  const MAX_SCALE = 1.25;
  const [scale, setScale] = useState(0.65);

  const clamp = (val) => Math.min(MAX_SCALE, Math.max(MIN_SCALE, val));

  const handleZoomIn = () => {
    setScale((s) => clamp(s + 0.15));
  };

  const handleZoomOut = () => {
    setScale((s) => clamp(s - 0.15));
  };

  // slider position 0–100 based on current scale
  const sliderPercent = ((scale - MIN_SCALE) / (MAX_SCALE - MIN_SCALE)) * 100;

  const handleSliderClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickY = e.clientY - rect.top;
    const percent = clickY / rect.height; // 0 at top, 1 at bottom
    const newScale = MIN_SCALE + (MAX_SCALE - MIN_SCALE) * percent;
    setScale(clamp(newScale));
  };

// Validate authentication token
const validateAuthToken = (userData, storedToken) => {
  if (!userData || !storedToken) return false;
  
  const expectedToken = generateAuthToken(userData);
  return expectedToken === storedToken;
};

// Check if user is logged in and validate token
useEffect(() => {
  const checkAuth = () => {
    try {
      const userDataStr = localStorage.getItem("userData");
      const authToken = localStorage.getItem("authToken");
      
      if (!userDataStr || !authToken) {
        // No data found, user is not logged in
        setIsUserLoggedIn(false);
        setUserData(null);
        return;
      }
      
      const parsed = JSON.parse(userDataStr);
      
      // Validate token
      if (!validateAuthToken(parsed, authToken)) {
        // Token mismatch - data has been tampered with
        console.warn("Authentication token mismatch. Logging out.");
        handleLogout(false); // Pass false to suppress alert
        return;
      }
      
      // Everything checks out
      if (parsed.isLoggedIn === true) {
        setIsUserLoggedIn(true);
        setUserData(parsed);
      } else {
        setIsUserLoggedIn(false);
        setUserData(null);
      }
    } catch (e) {
      console.error("Error parsing user data:", e);
      handleLogout(false); // Pass false to suppress alert
    }
  };
  
  checkAuth();
  
  // Optional: Re-validate periodically (every 5 minutes)
  const intervalId = setInterval(checkAuth, 5 * 60 * 1000);
  
  return () => clearInterval(intervalId);
}, []);



// Handle login success with user data
const handleLoginSuccess = (loggedInUserData) => {
  setIsUserLoggedIn(true);
  setUserData(loggedInUserData);
  
  // Execute pending action after login
  if (pendingAction) {
    pendingAction();
    setPendingAction(null);
  }
};

// Handle logout
// Handle logout
const handleLogout = (showAlert = true) => {
  localStorage.removeItem("userData");
  localStorage.removeItem("authToken");
  setIsUserLoggedIn(false);
  setUserData(null);
  
  if (showAlert) {
    alert("You have been logged out successfully.");
  }
};

// Check login before action
const checkLoginAndExecute = (action) => {  
  // Re-validate authentication before allowing action
  const userDataStr = localStorage.getItem("userData");
  const authToken = localStorage.getItem("authToken");
  
  if (userDataStr && authToken) {
    try {
      const parsed = JSON.parse(userDataStr);
      if (validateAuthToken(parsed, authToken) && parsed.isLoggedIn) {
        // Valid authentication - execute action
        action();
        return;
      }
    } catch (e) {
      console.error("Auth validation error:", e);
    }
  }
  
  // Not authenticated or token invalid - show login modal
  handleLogout(false); // Pass false to suppress the alert
  setPendingAction(() => action);
  setShowLoginModal(true);
};


  return (
    <div className="grid grid-rows-[10%_90%] grid-cols-1 gap-[2vw] h-screen w-full  bg-gray-50 overflow-hidden">
      {/* Top Right - Export Button with Dropdown */}

      <div className="fixed top-0 left-0 w-full z-50 bg-white shadow-sm border-b border-gray-200 py-[.05vw] ">
        <div className="flex items-center justify-center px-8 py-[.25vw] relative">
          <div className="logo-nav-container flex items-center gap-[4.5vw] pl-[1vw] relative">
            {/* Logo */}

            <img
              src={mainLogo}
              alt="RK Poly Products logo"
              className="w-[4vw] h-auto"
            />

          </div>
              <ProfileDropdown
      isLoggedIn={isUserLoggedIn}
      userData={userData}
      onLoginClick={() => setShowLoginModal(true)}
      onLogoutClick={handleLogout}
      
    />
        </div>
      </div>

      <div className="grid grid-cols-[75%_25%] h-[100vh] overflow-y-hidden w-full">
        {/* left SIDE - MODEL VIEWER */}

        <div
          className="h-full  bg-gray-200 rounded-[.5vw] shadow-lg overflow-hidden relative model-viewer-container "
          style={{ backgroundColor: bgColor }}
        >




        {/* ✅ ADD THIS: Plain/IML Toggle Buttons - Top Right */}
  <div className="absolute top-[4vw] right-4 z-[999] flex gap-2">
    <button
      onClick={() => handleViewModeChange("plain")}
      className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all cursor-pointer ${
        viewMode === "plain"
          ? "bg-2F5755 text-black shadow-lg"
          : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 "
      }`}
    >
      PLAIN
    </button>
    <button
      onClick={() => handleViewModeChange("iml")}
      className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all cursor-pointer ${
        viewMode === "iml"
          ? "bg-2F5755 text-black shadow-lg"
          : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
      }`}
    >
      IML
    </button>
  </div>
          <div className="flex flex-col items-center gap-[0.25vw] absolute top-[15%] left-[5%] z-[999]">
            {/* Zoom in */}

            <button
              onClick={handleZoomIn}
              className="mb-2"
              aria-label="Zoom in"
            >
              {/* simple + magnifier icon */}

              <span className="cursor-pointer">
                <svg
                  className="w-[1.75vw] h-[1.75vw]"
                  viewBox="0 0 32 32"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M30.9091 30.9092L23.6708 23.6709M23.6708 23.6709C22.4327 24.9091 20.9628 25.8912 19.3451 26.5613C17.7274 27.2313 15.9936 27.5762 14.2426 27.5762C12.4916 27.5762 10.7578 27.2313 9.14009 26.5613C7.52239 25.8912 6.05251 24.9091 4.81438 23.6709C3.57625 22.4328 2.59411 20.9629 1.92403 19.3452C1.25396 17.7275 0.90908 15.9937 0.909081 14.2427C0.909081 12.4917 1.25396 10.7579 1.92403 9.14018C2.59411 7.52249 3.57625 6.05261 4.81438 4.81448C7.3149 2.31396 10.7063 0.90918 14.2426 0.90918C17.7789 0.90918 21.1703 2.31396 23.6708 4.81448C26.1713 7.315 27.5761 10.7064 27.5761 14.2427C27.5761 17.779 26.1713 21.1704 23.6708 23.6709ZM9.24266 14.2427H19.2425M14.2426 9.24276V19.2426"
                    stroke="#1E1E1E"
                    strokeWidth="1.81816"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </button>

            {/* Vertical slider */}

            <div
              className="relative w-[.75vw] h-[25vh] bg-transparent rounded-full pointer-events-none border border-gray-400"
              onClick={handleSliderClick}
            >
              {/* filled part */}

              <div
                className="absolute left-1/2 -translate-x-1/2 w-[.6vw] bg-black rounded-full"
                style={{ top: `${100 - sliderPercent}%`, bottom: 0 }}
              />
            </div>

            {/* Zoom out */}

            <button
              onClick={handleZoomOut}
              className="mt-2"
              aria-label="Zoom out"
            >
              {/* simple - magnifier icon */}

              <span className="cursor-pointer">
                <svg
                  className="w-[1.75vw] h-[1.75vw]"
                  viewBox="0 0 33 33"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M24.6967 24.6968L31.3633 31.3634M9.69685 14.6969H19.6967M1.36362 14.6969C1.36362 18.2331 2.76836 21.6245 5.26882 24.1249C7.76927 26.6254 11.1606 28.0301 14.6968 28.0301C18.233 28.0301 21.6243 26.6254 24.1248 24.1249C26.6252 21.6245 28.03 18.2331 28.03 14.6969C28.03 11.1608 26.6252 7.76942 24.1248 5.26897C21.6243 2.76851 18.233 1.36377 14.6968 1.36377C11.1606 1.36377 7.76927 2.76851 5.26882 5.26897C2.76836 7.76942 1.36362 11.1608 1.36362 14.6969Z"
                    stroke="#1E1E1E"
                    strokeWidth="2.72724"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </button>
          </div>

          <model-viewer
            ref={modelRef}
            src={displayModel}
            alt="Container"
            camera-controls
            shadow-intensity="1"
            shadow-softness="1"
            exposure="1"
            disable-tap
            disable-zoom
            disable-pan
            tone-mapping="commerce"
            crossorigin="anonymous"
            className="mt-[-4.5vw] scale-[.65]"
            style={{
              width: "100%",
              height: "100%",
              scale: modelScaleValue,
              transform: `scale(${scale})`,
              transformOrigin: "center center",
              opacity: modelLoaded ? 1 : 0,
              transition: "scale 0.006s ease-in-out",
            }}
          />

          {/* BOTTOM CONTROL BAR – replace your existing absolute bottom div */}

          <div className="absolute left-[2vw] bottom-[0.5vw] w-[72vw] h-[30.5vh] bg-[#ffffff] border border-gray-200 rounded-[0.8vw] shadow-sm flex items-stretch justify-between px-[1.5vw] py-[1vw] gap-[2vw]">
            {/* LEFT: UPLOAD DESIGN (2 CARDS) */}

            <div className="flex-2 flex flex-col">
              {/* Section title */}

              <div className="flex items-center gap-[0.6vw] mb-[0.65vw] mt-[.5vw]">
                <img
                  src={uploadDesign}
                  className="w-[2.5vw] h-[2.5vw] mt-[-0.5vw] "
                />

                <div>
                  <h3 className="text-[1vw] font-bold text-gray-800 underline underline-offset-8 decoration-[#2F5755] decoration-2">
                    Upload Design
                  </h3>

                  {/* <div className="h-[0.2vw] w-[4vw] bg-[#37A4FF] rounded-full mt-[0.15vw]" /> */}
                </div>
              </div>

              {/* Cards row */}

              <div className="flex flex-1 gap-[1vw]">
                {/* IML Design card */}

                <div className="flex-1 bg-white rounded-[0.8vw] border border-gray-200 shadow-sm px-[1vw] py-[0.8vw] flex h-[20vh] gap-[1vw">
                  <div className="flex-col flex w-[55%] gap-[1vw] ">
                    {getModelCategory() === "sweet_box" ? (
                      // Sweet Box 5 - Two separate upload sections for lid and tub
                      <>
                        {/* Lid Upload Section */}
                        <div className="flex flex-col gap-[0.5vw] ml-[-0.35vw]">
                          <div className="flex items-center gap-[0.5vw]">
                            <img
                              src={imageIcon}
                              className="w-[1.8vw] h-[1.8vw]"
                            />
                            <div>
                              <p className="text-[0.9vw] font-semibold text-gray-800">
                                IML Design
                              </p>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-[1vw]">
                            <div className="flex flex-col">
                              <p className="text-[.95vw]">LID</p>
                              <p className="text-[.6vw] text-gray-700 mb-[.5vw]">
                                Size:{" "}
                                {selectedItem?.dimensions_lid ||
                                  "2809px X 448px (W x H)"}
                              </p>
                              <button
                                className="w-fit bg-[#2F5755] text-white text-[0.5vw] font-semibold rounded-[0.5vw] py-[0.3vw]  cursor-pointer flex text-center justify-center items-center px-[0.5vw]"
                                onClick={() => {
                                  setActivePart("lid");
                                  handleLidUploadClick();
                                }}
                              >
                                <img
                                  src={upArrowUploadIcon}
                                  className="w-[1.5vw] h-[2vh]"
                                />
                                <div>UPLOAD LID</div>
                              </button>

                              <input
                                type="file"
                                accept="image/*"
                                ref={lidFileInputRef}
                                onChange={handleLidFileChange}
                                className="hidden"
                              />
                            </div>

                            <div className="flex flex-col">
                              <p className="text-[.95vw]">TUB</p>
                              <p className="text-[.6vw] text-gray-700 mb-[.5vw] ">
                                Size:{" "}
                                {selectedItem?.dimensions_tub ||
                                  "2809px X 448px (W x H)"}
                              </p>
                              <button
                                className="w-fit bg-[#2F5755] text-white text-[0.5vw] font-semibold rounded-[0.5vw] py-[0.3vw]  cursor-pointer flex text-center justify-center items-center px-[0.5vw]"
                                onClick={() => {
                                  setActivePart("tub");
                                  handleTubUploadClick();
                                }}
                              >
                                <img
                                  src={upArrowUploadIcon}
                                  className="w-[1.5vw] h-[2vh]"
                                />
                                <div>UPLOAD TUB</div>
                              </button>

                              <input
                                type="file"
                                accept="image/*"
                                ref={tubFileInputRef}
                                onChange={handleTubFileChange}
                                className="hidden"
                              />
                            </div>
                            <input
                              type="file"
                              accept="image/*"
                              ref={fileInputRef}
                              onChange={handlePatternFileChange}
                              className="hidden"
                            />
                          </div>
                        </div>
                      </>
                    ) : (
                      // Round, Round Square, and Taper Evident (Sweet Box) - Single upload
                      <>
                        <div className="flex items-center gap-[0.5vw] mb-[0.5vw] pt-[.75vw]">
                          <img
                            src={imageIcon}
                            className="w-[1.8vw] h-[1.8vw]"
                          />
                          <div>
                            <p className="text-[0.9vw] font-semibold text-gray-800">
                              IML Design
                            </p>
                            <p className="text-[0.7vw] text-gray-500 leading-snug">
                              Upload Design Size:{" "}
                              {selectedItem?.dimensions ||
                                "2809px X 448px (W x H)"}
                            </p>
                          </div>
                        </div>

                        <button
                          className="w-fit bg-[#2F5755] text-white text-[0.8vw] font-semibold rounded-[0.5vw] py-[0.5vw]  cursor-pointer flex text-center justify-center items-center px-[1vw]"
                          onClick={handlePatternUploadClick}
                        >
                          <img
                            src={upArrowUploadIcon}
                            className="w-[2vw] h-[1.5vw]"
                          />
                          <div>UPLOAD LABEL IML DESIGN</div>
                        </button>

                        <input
                          type="file"
                          accept="image/*"
                          ref={fileInputRef}
                          onChange={handlePatternFileChange}
                          className="hidden"
                        />
                      </>
                    )}
                  </div>

                  {/* Thumbnails row */}

                  {/* For Sweet Box (5) - Show separate Lid and Tub patterns */}
{selectedItem?.lidPatterns && selectedItem?.tubPatterns ? (
  <>
    {/* LID PATTERNS */}
    <div className="pattern-section ">
      <h3 className="pattern-title">Lid Patterns</h3>
      <div className="pattern-grid">
        {selectedItem.lidPatterns.map((pattern, index) => (
          <div
            key={`lid-pattern-${index}`}
            className={`pattern-item ${
              selectedLidPattern === index + 1 ? "pattern-selected" : ""
            }`}
            onClick={() => handleLidPatternSelect(index + 1)}
          >
            <img src={pattern} alt={`Lid Pattern ${index + 1}`} />
            <span className="pattern-number">{index + 1}</span>
          </div>
        ))}
      </div>
    </div>

    {/* TUB PATTERNS */}
    <div className="pattern-section">
      <h3 className="pattern-title">Tub Patterns</h3>
      <div className="pattern-grid">
        {selectedItem.tubPatterns.map((pattern, index) => (
          <div
            key={`tub-pattern-${index}`}
            className={`pattern-item ${
              selectedTubPattern === index + 1 ? "pattern-selected" : ""
            }`}
            onClick={() => handleTubPatternSelect(index + 1)}
          >
            <img src={pattern} alt={`Tub Pattern ${index + 1}`} />
            <span className="pattern-number">{index + 1}</span>
          </div>
        ))}
      </div>
    </div>
  </>
) : (
  /* For other products - Show single pattern grid */
  selectedItem?.patterns && (
    <div className="pattern-section ">
      <h3 className="pattern-title">Default Patterns</h3>
      <div className="pattern-grid">
        {selectedItem.patterns.map((pattern, index) => (
          <div
            key={`pattern-${index}`}
            className={`pattern-item ${
              selectedPattern === index + 1 ? "pattern-selected" : ""
            }`}
            onClick={() => handlePatternSelect(index + 1)}
          >
            <img src={pattern} alt={`Pattern ${index + 1}`} />
            <span className="pattern-number">{index + 1}</span>
          </div>
        ))}
      </div>
    </div>
  )
)}

                </div>
              </div>
            </div>

            {/* RIGHT: CHOOSE TYPE (matches existing functionality) */}

            <div className="flex-1 flex flex-col">
              {/* Section title */}

              <div className="flex items-center gap-[0.6vw] mb-[0.5vw] mt-[.5vw]">
                <img
                  src={chooseType}
                  className="w-[2.5vw] h-[2.5vw] mt-[-0.5vw]"
                />

                <div>
                  <h3 className="text-[1vw] font-bold text-gray-800 underline underline-offset-8 decoration-[#2F5755] decoration-2">
                    Choose Type
                  </h3>

                  {/* <div className="h-[0.2vw] w-[4vw] bg-[#37A4FF] rounded-full mt-[0.15vw]" /> */}
                </div>
              </div>

              {/* Card content */}

              <div className="flex-1 bg-white rounded-[0.8vw] border border-gray-200 shadow-sm px-[1.2vw] py-[0.9vw] grid grid-cols-[35%_65%] gap-[1vw] h-[20vh]">
                {/* LEFT: LID / TUB toggle */}

                <div className="flex flex-col gap-[0.7vw] h-full">
                  {/* LID button */}

                  <button
                    type="button"
                    onClick={() => setActivePart("lid")}
                    className={`flex-1 flex items-center justify-center cursor-pointer gap-[0.5vw] rounded-[0.5vw] text-[0.85vw] font-semibold 
        ${
          activePart === "lid"
            ? "border border-[#2F5755] text-gray-800 bg-[#F3FAFF]"
            : "border border-gray-300 text-gray-700 bg-white"
        }`}
                  >
                    <span className="w-[0.8vw] h-[0.8vw] rounded-full border-2 border-[#2F5755] flex items-center justify-center">
                      <span
                        className={`w-[0.45vw] h-[0.45vw] rounded-full 
            ${activePart === "lid" ? "bg-[#2F5755]" : "bg-transparent"}`}
                      />
                    </span>
                    LID
                  </button>

                  {/* TUB button */}

                  <button
                    type="button"
                    onClick={() => setActivePart("tub")}
                    className={`flex-1 flex items-center justify-center cursor-pointer gap-[0.5vw] rounded-[0.5vw] text-[0.85vw] font-semibold 
        ${
          activePart === "tub"
            ? "border border-[#2F5755] text-gray-800 bg-[#F3FAFF]"
            : "border border-gray-300 text-gray-700 bg-white"
        }`}
                  >
                    <span className="w-[0.8vw] h-[0.8vw] rounded-full border-2 border-[#2F5755] flex items-center justify-center">
                      <span
                        className={`w-[0.45vw] h-[0.45vw] rounded-full 
            ${activePart === "tub" ? "bg-[#2F5755]" : "bg-transparent"}`}
                      />
                    </span>
                    TUB
                  </button>
                </div>

                {/* RIGHT: color picker + presets */}

                <div className="flex flex-col justify-between gap-[1vw] h-[98%]">
                  {/* input[type=color] – when changed, switch to Customize and apply to active part */}

                  <div className="flex gap-[.75vw]">
                    <input
                      type="color"
                      value={activePart === "lid" ? topColor : bottomColor}
                      onChange={(e) => {
                        const newColor = e.target.value;
                        if (activePart === "lid") {
                          setLidColorMode("custom");
                          setTopColor(newColor);
                        } else {
                          setTubColorMode("custom");
                          setBottomColor(newColor);
                        }
                      }}
                      className="w-full h-full rounded-[.5vw] cursor-pointer border-gray-300 hover:border-indigo-500"
                    />

                    {/* RGB + hex (read-only for now) */}

                    <div className="flex flex-col mr-[.75vw]">
                      {/* <div className="flex items-center gap-[0.3vw] mb-[0.5vw]">
                        {["R", "G", "B"].map((l) => (
                          <input
                            key={l}
                            readOnly
                            className="w-[2.2vw] h-[1.6vw] border border-gray-300 rounded-[0.3vw] text-center text-[0.7vw] text-gray-500 bg-white"
                            placeholder={l}
                          />
                        ))}
                      </div> */}

                      <input
                        readOnly
                        className="flex-1 h-[1.6vw] w-full border border-gray-300 rounded-[0.3vw] text-[0.85vw] text-gray-500 px-[0.4vw] py-[.5vw] bg-white w-[2vw] text-center"
                        value={activePart === "lid" ? topColor : bottomColor}
                      />
                    </div>
                  </div>

                  {/* gradient bar */}

                  {/* <div className="w-full h-[1vw] mt-auto rounded-[0.5vw] overflow-hidden bg-gradient-to-r from-red-500 via-yellow-500 to-blue-500 mb-[0.4vw]" /> */}

                  {/* color mode – behaves like radio group but styled as checkboxes */}

                  <div className="grid grid-cols-2 gap-y-[0.3vw] text-[0.75vw] text-gray-700 mt-[-0.5vw]">
                    {/* White */}
                    <button
                      type="button"
                      onClick={() => {
                        if (activePart === "lid") {
                          setLidColorMode("white");
                          setTopColor("#ffffff");
                        } else {
                          setTubColorMode("white");
                          setBottomColor("#ffffff");
                        }
                      }}
                      className="inline-flex items-center gap-[0.3vw] cursor-pointer"
                    >
                      <span
                        className={`w-[0.8vw] h-[0.8vw] rounded-[0.2vw] border-2 
        ${
          (activePart === "lid" &&
            lidColorMode === "white" &&
            topColor === "#ffffff") ||
          (activePart === "tub" &&
            tubColorMode === "white" &&
            bottomColor === "#ffffff")
            ? "border-[#2F5755] bg-[#2F5755]"
            : "border-gray-300 bg-white"
        }`}
                      />
                      White
                    </button>

                    {/* Black */}
                    <button
                      type="button"
                      onClick={() => {
                        if (activePart === "lid") {
                          setLidColorMode("black");
                          setTopColor("#000000");
                        } else {
                          setTubColorMode("black");
                          setBottomColor("#000000");
                        }
                      }}
                      className="inline-flex items-center gap-[0.3vw] cursor-pointer"
                    >
                      <span
                        className={`w-[0.8vw] h-[0.8vw] rounded-[0.2vw] border-2 
        ${
          (activePart === "lid" &&
            lidColorMode === "black" &&
            topColor === "#000000") ||
          (activePart === "tub" &&
            tubColorMode === "black" &&
            bottomColor === "#000000")
            ? "border-[#2F5755] bg-[#2F5755]"
            : "border-gray-300 bg-white"
        }`}
                      />
                      Black
                    </button>

                    {/* Transparent */}
                    <button
                      type="button"
                      onClick={() => {
                        const transparentColor = "rgba(255, 255, 255, 0)";
                        if (activePart === "lid") {
                          setLidColorMode("transparent");
                          setTopColor(transparentColor);
                        } else {
                          setTubColorMode("transparent");
                          setBottomColor(transparentColor);
                        }
                      }}
                      className="inline-flex items-center gap-[0.3vw] cursor-pointer"
                    >
                      <span
                        className={`w-[0.8vw] h-[0.8vw] rounded-[0.2vw] border-2 
        ${
          (activePart === "lid" &&
            lidColorMode === "transparent" &&
            topColor === "rgba(255, 255, 255, 0)") ||
          (activePart === "tub" &&
            tubColorMode === "transparent" &&
            bottomColor === "rgba(255, 255, 255, 0)")
            ? "border-[#2F5755] bg-[#2F5755]"
            : "border-gray-300 bg-white"
        }`}
                      />
                      Transparent
                    </button>

                    {/* Customize */}
                      {/* <button
                        type="button"
                        onClick={() => {
                          if (activePart === "lid") {
                            setLidColorMode("custom");
                          } else {
                            setTubColorMode("custom");
                          }
                        }}
                        className="inline-flex items-center gap-[0.3vw] pointer-events-none"
                      >
                        <span
                          className={`w-[0.8vw] h-[0.8vw] rounded-[0.2vw] border-2 
          ${
            (activePart === "lid" &&
              lidColorMode === "custom" &&
              topColor !== "#ffffff" &&
              topColor !== "#000000" &&
              topColor !== "rgba(255, 255, 255, 0)") ||
            (activePart === "tub" &&
              tubColorMode === "custom" &&
              bottomColor !== "#ffffff" &&
              bottomColor !== "#000000" &&
              bottomColor !== "rgba(255, 255, 255, 0)")
              ? "border-[#2F5755] bg-[#2F5755]"
              : "border-gray-300 bg-white"
          }`}
                        />
                        Customize
                      </button> */}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* <button
            onClick={() => {
              checkLoginAndExecute(() => {
                setShowExportMenu(!showExportMenu)
              });
            }}
            className="px-[1.5vw] py-[0.5vw] bg-black ml-auto mr-[2vw] absolute bottom-[32.5%] right-[0vw] text-white rounded-full text-[0.95vw] font-regular shadow-lg hover:shadow-xl hover:bg-gray-800 cursor-pointer transition-all flex items-center gap-[0.5vw]"
          >
            Export
            <span className={`transition-transform ${showExportMenu ? "rotate-180" : ""}`}>
            ▼
          </span>
          </button> */}

          {showExportMenu && (
            <div className="absolute bottom-[10.5vw] right-[0vw] bg-white rounded-[0.5vw] shadow-xl border border-gray-300 overflow-hidden z-50">
              <button
                onClick={handleExportPDF}
                className="w-full px-[1.2vw] py-[0.6vw] text-left text-[0.9vw] text-gray-700 font-semibold hover:bg-red-50 hover:text-red-700 transition-all flex items-center gap-[0.5vw] cursor-pointer"
              >
                PDF
              </button>

              <div className="h-px bg-gray-200"></div>

              <button
                onClick={handleExportGLB}
                className="w-full px-[1.2vw] py-[0.6vw] text-left text-[0.9vw] text-gray-700 font-semibold hover:bg-purple-50 hover:text-purple-700 transition-all flex items-center gap-[0.5vw] cursor-pointer"
              >
                GLB
              </button>
            </div>
          )}

          {/* Background Color Picker */}

          <div className="absolute bottom-[32.5%] left-[2.5%] bg-white rounded-[0.8vw] shadow-sm px-[1.2vw] py-[.7vw] flex items-center gap-[0.6vw] z-50 w-[15%]">
            <input
              type="color"
              value={bgColor}
              onChange={(e) => setBgColor(e.target.value)}
              className="w-[3vw] h-[3.25vw] rounded-[0.5vw] cursor-pointer border border-gray-100"
            />

            <div className="flex flex-col w-[50%]">
              <label className="text-[0.9vw] font-bold text-gray-900">
                BG Colour
              </label>

              {/* Hex Value Input */}

              <input
                type="text"
                value={bgColor}
                onChange={(e) => {
                  const value = e.target.value;
                  // Allow only valid hex input
                  if (/^#([0-9A-Fa-f]{0,6})$/.test(value)) {
                    setBgColor(value);
                  }
                }}
                className="text-[0.85vw] w-full text-gray-700 font-mono text-center border border-gray-400 rounded px-[0.4vw] py-[0.2vw] focus:outline-none focus:ring-1 focus:ring-gray-300"
              />
            </div>
          </div>
        </div>

        {/* right SIDE - CONTROLS */}

        <div className="h-full w-[25vw] bg-[#2F5755] shadow-lg p-[1.5vw] pt-[4vw] overflow-y-hidden space-y-[1vw] pt-0">
          {/* MODELS / CATEGORIES SECTION */}

          <div className="">
            <div className="top-[0vw] z-10 ">
              <h3 className="text-[1.5vw]  font-bold text-white  mb-[.4vw] ">
                Container
              </h3>

              <p
                className="text-[.8vw] font-regular text-[#efefef] font-play "
                style={{ fontFamily: "play" }}
              >
                Customize Every Detail of Your Product Packaging With Our
                Advanced 3D Mockup Tool
              </p>

              <div className="flex mt-[.75vw] mb-[1vw]">
                <img src={modelIcon} className="w-[2vw] my-[1vw]" />

                <p className="text-[1.5vw] text-[#efefef] font-[500] my-auto mx-[1vw] border-b border-[#cdcdcd] border-b-[.15vw] pb-[.15vw]">
                  Models
                </p>
              </div>
            </div>

            <div className="overflow-y-auto max-h-[68vh]">
              {categories.map((cat) => {
                const isOpen = openCategory === cat.id;
                return (
                  <div
                    key={cat.id}
                    className={`mb-[0.75vw] overflow-y-auto rounded-[0.5vw] ${
                      isOpen ? "border border-gray-300" : ""
                    }`}
                  >
                    <button
                      onClick={() => setOpenCategory(isOpen ? null : cat.id)}
                      className="w-full flex items-center justify-between px-[1.15vw] py-[.85vw] rounded-[.5vw] font-medium bg-[#3d3d3d] text-black border border-gray-400 cursor-pointer"
                      aria-expanded={isOpen}
                      aria-controls={`cat-${cat.id}`}
                    >
                      <div className="flex items-center gap-[1vw]">
                        <img src={cat.image} className="w-[4vw]" />

                        <span className="font-[500] text-[1.1vw] text-white">
                          {cat.title}
                        </span>
                      </div>

                      <span className="text-black w-[1vw] h-[1vw] pt-[.25vw]">
                        {isOpen ? (
                          <img src={upArrowIcon} style={{filter: "brightness(100)"}} />
                        ) : (
                          <img src={downArrowIcon} style={{filter: "brightness(100)"}} />
                        )}
                      </span>
                    </button>

                    <div
                      id={`cat-${cat.id}`}
                      className={`mt-[.3vw]  transition-all overflow-hidden ${
                        isOpen ? "max-h-[50vw]" : "max-h-0"
                      } `}
                      style={{ transition: "max-height .5s ease-in" }}
                    >
                      {/* STEP 3: Updated grid layout with images */}

                      <div className="space-y-[.2vw] mt-[.2vw] grid grid-cols-3 gap-[1vw] mx-[1vw] my-[1vw] pt-[.5vw]">
                        {cat.items.map((item) => {
                          const isSelected = selectedModel === item.path;
                          return (
                            <button
                              key={item.id}
                              onClick={() => {
                                if (!isSelected) {
                                  handleModelChange(item.path);
                                  setOpenCategory(cat.id);
                                }
                              }}
                              className={`flex flex-col items-center gap-[0.4vw]  relative rounded-[.5vw] cursor-pointer transition-all pb-[.5vw] ${
                                isSelected
                                  ? "bg-[#77C6FF] text-white shadow-md border-[#2B7FFF] border-1"
                                  : "bg-[#EFF6FF] text-black hover:bg-gray-50 border border-gray-200"
                              }`}
                            >
                              {/* STEP 4: Display product image */}

                              <img
                                src={item.image}
                                alt={item.label}
                                className="w-[4vw] h-[4vw] object-contain absolute top-[0vw]"
                              />

                              <div
                                className={`w-[5vw] h-[4vw] mt-[2vw] rounded-[.5vw] flex items-center justify-center"  ${
                                  isSelected
                                    ? " bg-[#0095FF]"
                                    : "  bg-[#ffffff] border border-gray-200"
                                }`}
                              >
                                {/* STEP 5: Display label below image */}

                                <span
                                  className="text-[.65vw] pt-[1.65vw] w-full"
                                  dangerouslySetInnerHTML={{
                                    __html: item.display,
                                  }}
                                />
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
          <LoginModal
      isOpen={showLoginModal}
      onClose={() => {
        setShowLoginModal(false);
        setPendingAction(null);
      }}
      onLoginSuccess={handleLoginSuccess}
    />

    </div>
  );
}
