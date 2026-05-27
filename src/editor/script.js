let filters = {
    Brightness: {
        value: 100,
        min: 0,
        max: 200,
        unit: "%"
    },
    Contrast: {
        value: 100,
        min: 0,
        max: 200,
        unit: "%"
    },

    Saturation: {
        value: 100,
        min: 0,
        max: 200,
        unit: "%"
    },
    HueRotation: {
        value: 0,
        min: 0,
        max: 360,
        unit: "deg"
    },
    Blur: {
        value: 0,
        min: 0,
        max: 20,
        unit: "px"
    },
    Grayscale: {
        value: 0,
        min: 0,
        max: 100,
        unit: "%"
    },
    Sepia: {
        value: 0,
        min: 0,
        max: 100,
        unit: "%"
    },
    Opacity: {
        value: 100,
        min: 0,
        max: 100,
        unit: "%"
    },
    Invert: {
        value: 0,
        min: 0,
        max: 100,
        unit: "%"
    }
}

const filtersContainer = document.querySelector(".filters");
const imgInput = document.querySelector("#image-input");
const imageCanvas = document.querySelector("#image-canvas");
const canvasCtx = imageCanvas.getContext("2d");
const resetBtn = document.querySelector("#reset-btn");
const downloadbtn = document.querySelector("#download-btn");
const presetContainer = document.querySelector(".presets");
const imagePreview = document.querySelector("#image-preview");
const imageWrapper = document.querySelector(".image-wrapper");
let image = null;
let cropper = null;

function createFilterElement(name, unit = "%", value, min, max) {

    const div = document.createElement("div");
    div.classList.add("filter");


    const input = document.createElement("input");
    input.type = "range";
    input.id = name;
    input.value = value;
    input.min = min;
    input.max = max;

    const p = document.createElement("p");
    p.innerText = name;
    div.appendChild(input);
    div.appendChild(p);


    input.addEventListener("input", () => {
        filters[name].value = input.value;
        applyFilters();
    });


    return div;


}



function createFilters() {
    Object.keys(filters).forEach(key => {
        const filterElement = createFilterElement(key, filters[key].unit, filters[key].value, filters[key].min, filters[key].max);
        filtersContainer.appendChild(filterElement);
    })

}

createFilters();

imgInput.addEventListener("change", (event) => {
    console.log("image changed fired");
    const file = event.target.files[0];
    if (!file) return;

    if (cropper) {
        cropper.destroy();
        cropper = null;
    }

    imageWrapper.style.display = "block";
    const imagePlaceholder = document.querySelector(".placeholder");
    imagePlaceholder.style.display = "none";

    imagePreview.src = URL.createObjectURL(file);

    imagePreview.onload = () => {
        image = imagePreview;
        
        // Initialize Cropper.js
        cropper = new Cropper(imagePreview, {
            viewMode: 1,
            autoCropArea: 1, // Select full image by default
            dragMode: 'none', // Disable drawing new boxes
            ready: function () {
                applyFilters();
            }
        });
    };

    filtersContainer.innerHTML = "";
    createFilters();
});



function applyFilters() {
    if (!cropper) return;

    const filterString = `brightness(${filters.Brightness.value}${filters.Brightness.unit})
    contrast(${filters.Contrast.value}${filters.Contrast.unit})
    saturate(${filters.Saturation.value}${filters.Saturation.unit})
    hue-rotate(${filters.HueRotation.value}${filters.HueRotation.unit})
    blur(${filters.Blur.value}${filters.Blur.unit})
    grayscale(${filters.Grayscale.value}${filters.Grayscale.unit})
    sepia(${filters.Sepia.value}${filters.Sepia.unit})
    opacity(${filters.Opacity.value}${filters.Opacity.unit})
    invert(${filters.Invert.value}${filters.Invert.unit})`;

    const cropperImages = document.querySelectorAll('.cropper-container img');
    cropperImages.forEach(img => {
        img.style.filter = filterString;
    });
}



resetBtn.addEventListener("click", () => {
    filters = {
        Brightness: {
            value: 100,
            min: 0,
            max: 200,
            unit: "%"
        },
        Contrast: {
            value: 100,
            min: 0,
            max: 200,
            unit: "%"
        },
        Saturation: {
            value: 100,
            min: 0,
            max: 200,
            unit: "%"
        },
        HueRotation: {
            value: 0,
            min: 0,
            max: 360,
            unit: "deg"
        },
        Blur: {
            value: 0,
            min: 0,
            max: 20,
            unit: "px"
        },
        Grayscale: {
            value: 0,
            min: 0,
            max: 100,
            unit: "%"
        },
        Sepia: {
            value: 0,
            min: 0,
            max: 100,
            unit: "%"
        },
        Opacity: {
            value: 100,
            min: 0,
            max: 100,
            unit: "%"
        },
        Invert: {
            value: 0,
            min: 0,
            max: 100,
            unit: "%"
        }
    };
    applyFilters();
    filtersContainer.innerHTML = "";
    createFilters();
    if (cropper) {
        cropper.reset();
    }
});


function prepareCroppedCanvas() {
    if (!cropper || !image) return false;

    const data = cropper.getData(true);
    imageCanvas.width = data.width;
    imageCanvas.height = data.height;

    canvasCtx.clearRect(0, 0, imageCanvas.width, imageCanvas.height);
    canvasCtx.filter = `brightness(${filters.Brightness.value}${filters.Brightness.unit})
    contrast(${filters.Contrast.value}${filters.Contrast.unit})
    saturate(${filters.Saturation.value}${filters.Saturation.unit})
    hue-rotate(${filters.HueRotation.value}${filters.HueRotation.unit})
    blur(${filters.Blur.value}${filters.Blur.unit})
    grayscale(${filters.Grayscale.value}${filters.Grayscale.unit})
    sepia(${filters.Sepia.value}${filters.Sepia.unit})
    opacity(${filters.Opacity.value}${filters.Opacity.unit})
    invert(${filters.Invert.value}${filters.Invert.unit})`;

    canvasCtx.drawImage(image, data.x, data.y, data.width, data.height, 0, 0, data.width, data.height);
    return true;
}

downloadbtn.addEventListener("click", async () => {
    if (!prepareCroppedCanvas()) return;

    if (window.showSaveFilePicker) {
        try {
            const handle = await window.showSaveFilePicker({
                suggestedName: 'edited.png',
                types: [
                    {
                        description: 'PNG Image',
                        accept: { 'image/png': ['.png'] }
                    },
                    {
                        description: 'JPEG Image File',
                        accept: { 'image/jpeg': ['.jpg', '.jpeg'] }
                    },
                    {
                        description: 'WebP Image',
                        accept: { 'image/webp': ['.webp'] }
                    },
                ]
            });

            const fileHandle = await handle.getFile();
            const type = fileHandle.type;

            imageCanvas.toBlob(async (blob) => {
                const writable = await handle.createWritable();
                await writable.write(blob);
                await writable.close();
            }, type);

        }
        catch (err) {
            console.error("Save process interrupted:", err);
        }
    }
    else {
        const link = document.createElement("a");
        link.download = 'cropped_edited.png';
        link.href = imageCanvas.toDataURL();
        link.click();
    }
});

const presets = {
    "Drama": {
        Brightness: 90,
        Contrast: 150,
        Saturation: 120,
        HueRotation: 0,
        Blur: 0,
        Grayscale: 0,
        Sepia: 0,
        Opacity: 100,
        Invert: 0
    },
    "Vintage": {
        Brightness: 110,
        Contrast: 90,
        Saturation: 80,
        HueRotation: 0,
        Blur: 0,
        Grayscale: 0,
        Sepia: 40,
        Opacity: 100,
        Invert: 0
    },
    "Oldschool": {
        Brightness: 100,
        Contrast: 110,
        Saturation: 70,
        HueRotation: 0,
        Blur: 1,
        Grayscale: 20,
        Sepia: 50,
        Opacity: 100,
        Invert: 0
    },
    "Cyberpunk": {
        Brightness: 110,
        Contrast: 130,
        Saturation: 180,
        HueRotation: 280, // Shifts toward purples/pinks
        Blur: 0,
        Grayscale: 0,
        Sepia: 0,
        Opacity: 100,
        Invert: 0
    },
    "Softglow": {
        Brightness: 120,
        Contrast: 90,
        Saturation: 105,
        HueRotation: 0,
        Blur: 3,
        Grayscale: 0,
        Sepia: 5,
        Opacity: 95,
        Invert: 0
    },
    "Noir": {
        Brightness: 100,
        Contrast: 160,
        Saturation: 0,
        HueRotation: 0,
        Blur: 0,
        Grayscale: 100,
        Sepia: 0,
        Opacity: 100,
        Invert: 0
    },
    "WarmSunset": {
        Brightness: 110,
        Contrast: 110,
        Saturation: 130,
        HueRotation: 20,
        Blur: 0,
        Grayscale: 0,
        Sepia: 30,
        Opacity: 100,
        Invert: 0
    },
    "CoolTone": {
        Brightness: 100,
        Contrast: 100,
        Saturation: 90,
        HueRotation: 190,
        Blur: 0,
        Grayscale: 10,
        Sepia: 0,
        Opacity: 100,
        Invert: 0
    },
    "Faded": {
        Brightness: 115,
        Contrast: 80,
        Saturation: 85,
        HueRotation: 0,
        Blur: 0,
        Grayscale: 0,
        Sepia: 10,
        Opacity: 100,
        Invert: 0
    },
    "RetroPop": {
        Brightness: 110,
        Contrast: 140,
        Saturation: 200,
        HueRotation: 0,
        Blur: 0,
        Grayscale: 0,
        Sepia: 0,
        Opacity: 100,
        Invert: 0
    }
};



function createPreset() {

    Object.keys(presets).forEach(presetName => {
        const presetButton = document.createElement("button");
        presetButton.classList.add("preset-btn");
        presetButton.innerText = presetName;
        presetContainer.appendChild(presetButton);

        presetButton.addEventListener("click", () => {
            const presetFilters = presets[presetName];
            Object.keys(presetFilters).forEach(filterName => {
                filters[filterName].value = presetFilters[filterName];
            });
            applyFilters();
            filtersContainer.innerHTML = "";
            createFilters();

        });
    });
};

createPreset();



// Crop button click listener removed as crop widget handles selection dynamically