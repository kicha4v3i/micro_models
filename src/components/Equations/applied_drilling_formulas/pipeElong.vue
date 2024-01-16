<script setup>
import { ref, computed } from 'vue'
import store from '@/store'

// Data
const surfaceTemp = ref('')
const bottomTemp = ref('')

// Warning
const warning = ref(false)
const warningMsg = ref('')

const bottomTempWarn = () => {
    if (bottomTempBase.value < surfaceTempBase.value) {
        warning.value = true
        warningMsg.value = 'Bottom Hole Temperature should be higher than the Surface Temperature'
    }

    setTimeout(() => {
        warning.value = false
        warningMsg.value = ''
    }, 5000)
}

 
// Units
const surfaceTempUnit = ref('°C')
const bottomTempUnit = ref('°C')
const pipeElongUnit = ref('inch')

// Conversions
const surfaceTempConv = computed(() => {
    if (surfaceTemp.value == '') {
        return
    }
    if (surfaceTempUnit.value == '°C') {
        surfaceTemp.value = ((surfaceTemp.value - 32) * 5 / 9).toFixed(2)
    } else {
        surfaceTemp.value = (surfaceTemp.value * 9 / 5 + 32).toFixed(2)
    }
})

const bottomTempConv = computed(() => {
    if (bottomTemp.value == '') {
        return
    }
    if (bottomTempUnit.value == '°C') {
        bottomTemp.value = ((bottomTemp.value - 32) * 5 / 9).toFixed(2)
    } else {
        bottomTemp.value = (bottomTemp.value * 9 / 5 + 32).toFixed(2)
    }
})

// Base Units
const surfaceTempBase = computed(() => {
    if (surfaceTempUnit.value == '°C') {
        return surfaceTemp.value * 9 / 5 + 32
    } else {
        return surfaceTemp.value
    }
})

const bottomTempBase = computed(() => {
    if (bottomTempUnit.value == '°C') {
        return bottomTemp.value * 9 / 5 + 32
    } else {
        return bottomTemp.value
    }
})

const pipeLengthBase = computed(() => {
    if (store.inputUnits.pipeLengthUnit == 'm') {
        return store.mainInputs.pipeLength * 3.281
    } else {
        return store.mainInputs.pipeLength
    }
})

// Calculations
const pipeElong = computed(() => {
    if (surfaceTemp.value == '' || bottomTemp.value == '') {
        return 0
    }
    if (bottomTempBase.value < surfaceTempBase.value) {
        return 0
    }
    let avgTemp = (parseFloat(surfaceTempBase.value) + parseFloat(bottomTempBase.value)) / 2
    let tempDiff = avgTemp - surfaceTempBase.value

    if (pipeElongUnit.value == 'inch') {
        return (pipeLengthBase.value / 100 * (tempDiff / 100) * 0.83).toFixed(2)
    } else {
        return ((pipeLengthBase.value / 100 * (tempDiff / 100) * 0.83) / 12 / 3.281 * 1000).toFixed(0)
    }
})

</script>

<template>
    <div class="d-flex justify-content-between align-items-start">
        <div class="data-show d-flex ms-5 mt-5 align-items-center">
            <div class="inputs">

                <!-- Surface Temperature -->
                <div class="d-flex mt-3 align-items-center">
                    <div class="form-floating">
                        <input class="form-control" type="number" min="0" id="surfaceTemp" step="1" placeholder="Surface Temperature" v-model="surfaceTemp">
                        <label for="surfaceTemp" class="form-label">Surface Temperature</label>
                    </div>
                    <div class="unit ms-3">
                        <select @change="surfaceTempConv" v-model="surfaceTempUnit" class="form-select border-info">
                            <option>°C</option>
                            <option>°F</option>
                        </select>
                    </div>
                </div>

                <!-- Bottom Hole Temperature -->
                <div class="d-flex mt-3 align-items-center">
                    <div class="form-floating">
                        <input @focusout="bottomTempWarn" class="form-control" :class="{ 'is-invalid': warning }" type="number" min="0" id="bottomTemp" step="1" placeholder="Bottom Temperature" v-model="bottomTemp">
                        <label for="bottomTemp" class="form-label">Bottom Hole Temperature</label>
                    </div>
                    <div class="unit ms-3">
                        <select @change="bottomTempConv" v-model="bottomTempUnit" class="form-select border-info">
                            <option>°C</option>
                            <option>°F</option>
                        </select>
                    </div>
                </div>

                <!-- Warning Message -->
                <div v-if="warning" class="position-absolute">
                    <p class="text-danger">{{ warningMsg }}</p>
                </div>
            </div>

            <div class="outputs ms-5">
                <div class="lp-height d-flex align-items-end">
                    <div class="lp-height-out">
                        <span class="text-secondary text-uppercase fs-6">Pipe Elongation</span>
                        <h3 class="text-center text-success">{{ pipeElong }}</h3>
                    </div>
                    <div class="lp-height-unit">
                        <span>
                            <select class="form-select" v-model="pipeElongUnit">
                                <option>inch</option>
                                <option>mm</option>
                            </select>
                        </span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>