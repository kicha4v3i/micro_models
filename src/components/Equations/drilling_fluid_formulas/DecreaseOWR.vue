<script setup>
import { ref, computed } from 'vue'
import store from '@/store'

// Data
const oilPercent = ref('')
const newOilPercent = ref('')
const newWaterPercent = ref('')
const waterPercent = ref('')
const solidsPercent = ref('')
const mudVol = ref('')
const neutral = ref('true')
const increaseOWR = ref('false')
const decreaseOWR = ref('false')

// Unit
const mudVolUnit = ref('bbls')

// Auto Calculate % Required
const autoWater = computed(() => {
    newWaterPercent.value = 100 - newOilPercent.value
})

const autoOil = computed(() => {
    newOilPercent.value = 100 - newWaterPercent.value
})

// Conversions
let preMudVol = 'bbls'
const mudVolConv = computed(() => {
    if (preMudVol == 'bbls') {
        if (mudVolUnit.value == 'gal') {
            mudVol.value = (mudVol.value * 42).toFixed(1)
            preMudVol = 'gal'
        } else if (mudVolUnit.value == 'cu.m') {
            mudVol.value = (mudVol.value * 0.1589).toFixed(3)
            preMudVol = 'cu.m'
        } else {
            mudVol.value = (mudVol.value * 5.615).toFixed(3)
            preMudVol = 'cu.ft'
        }
    } else if (preMudVol == 'gal') {
        if (mudVolUnit.value == 'bbls') {
            mudVol.value = (mudVol.value / 42).toFixed(3)
            preMudVol = 'bbls'
        } else if (mudVolUnit.value == 'cu.m') {
            mudVol.value = (mudVol.value * 0.00378).toFixed(3)
            preMudVol = 'cu.m'
        } else {
            mudVol.value = (mudVol.value * 0.13368).toFixed(3)
            preMudVol = 'cu.ft'
        }
    } else if (preMudVol == 'cu.m') {
        if (mudVolUnit.value == 'bbls') {
            mudVol.value = (mudVol.value / 0.1589).toFixed(1)
            preMudVol = 'bbls'
        } else if (mudVolUnit.value == 'gal') {
            mudVol.value = (mudVol.value / 0.00378).toFixed(1)
            preMudVol = 'gal'
        } else {
            mudVol.value = (mudVol.value * 35.3147).toFixed(3)
            preMudVol = 'cu.ft'
        }
    } else {
        if (mudVolUnit.value == 'bbls') {
            mudVol.value = (mudVol.value /5.615).toFixed(1)
            preMudVol = 'bbls'
        } else if (mudVolUnit.value == 'gal') {
            mudVol.value = (mudVol.value / 0.13368).toFixed(1)
            preMudVol = 'gal'
        } else {
            mudVol.value = (mudVol.value / 35.3147).toFixed(3)
            preMudVol = 'cu.m'
        }
    }
})

// Calculations
const originalOil = computed(() => {
    return oilPercent.value / (oilPercent.value + waterPercent.value)
})

const originalWater = computed(() => {
    return waterPercent.value / (oilPercent.value + waterPercent.value)
})

const requirement = computed(() => {
     
    if (newOilPercent.value > originalOil.value * 100) {
        increaseOWR.value = true
        decreaseOWR.value = false
        neutral.value = false
    } else if (newOilPercent.value < originalOil.value * 100) {
        increaseOWR.value = false
        decreaseOWR.value = true
        neutral.value = false
    } else {
        increaseOWR.value = false
        decreaseOWR.value = false
        neutral.value = true
    }

})

const addWater = computed(() => {
    // Base Units
    let mudVolBase
    if (mudVolUnit.value == 'cu.ft') {
        mudVolBase = mudVol.value / 5.615
    } else if (mudVolUnit.value == 'cu.m') {
        mudVolBase = mudVol.value / 0.1589
    } else if (mudVolUnit.value == 'gal') {
        mudVolBase = mudVol.value / 42
    } else {
        mudVolBase = mudVol.value
    }

    if (decreaseOWR.value) {
        let totWater = oilPercent.value * mudVolBase / newOilPercent.value
        let oriVol = oilPercent.value / 100 * mudVolBase + waterPercent.value / 100 * mudVolBase

        if (mudVolUnit.value == 'bbls') {
            return totWater - oriVol
        } else if (mudVolUnit.value == 'gal') {
            return (totWater - oriVol) * 42
        } else if (mudVolUnit.value == 'cu.m') {
            return (totWater - oriVol) * 0.1589
        } else {
            return (totWater - oriVol) * 5.615
        }
    } else if (increaseOWR.value) {
        let totWater = waterPercent.value * mudVolBase  / newWaterPercent.value
        let oriVol = waterPercent.value / 100 * mudVolBase + oilPercent.value / 100 * mudVolBase 

        if (mudVolUnit.value == 'bbls') {
            return totWater - oriVol
        } else if (mudVolUnit.value == 'gal') {
            return (totWater - oriVol) * 42
        } else if (mudVolUnit.value == 'cu.m') {
            return (totWater - oriVol) * 0.1589
        } else {
            return (totWater - oriVol) * 5.615
        }
    }
})

</script>
<template>
    <div class="d-flex justify-content-between align-items-start">
        <div class="data-show d-flex ms-5 mt-5 align-items-start flex-column">
            <div class="inputs">
                <div class="d-flex">
                    <div class="original">
                        <p class="fw-semibold">Original Mud Properties</p>

                        <!-- % of Oil -->
                        <div class="d-flex mt-3 align-items-center">
                            <div class="form-floating">
                                <input class="form-control" type="number" min="0" id="oilPercent" step="1" placeholder="%ofOil" v-model="oilPercent">
                                <label for="oilPercent" class="form-label">% by volume of Oil</label>
                            </div>
                            <span class="align-baseline text-secondary fs-6 ms-3">%</span>
                        </div>

                        <!-- % of Water -->
                        <div class="d-flex mt-3 align-items-center">
                            <div class="form-floating">
                                <input class="form-control" type="number" min="0" id="waterPercent" step="1" placeholder="%ofWater" v-model="waterPercent">
                                <label for="waterPercent" class="form-label">% by volume of Water</label>
                            </div>
                            <span class="align-baseline text-secondary fs-6 ms-3">%</span>
                        </div>

                        <!-- % of Solids -->
                        <div class="d-flex mt-3 align-items-center">
                            <div class="form-floating">
                                <input class="form-control" type="number" min="0" id="solidsPercent" step="1" placeholder="%ofSolids" v-model="solidsPercent">
                                <label for="solidsPercent" class="form-label">% by volume of Solids</label>
                            </div>
                            <span class="align-baseline text-secondary fs-6 ms-3">%</span>
                        </div>

                        <!-- Volume of Mud -->
                        <div class="d-flex mt-3 align-items-center">
                            <div class="form-floating">
                                <input class="form-control" type="number" min="0" id="mudVolume" step="1" placeholder="consistencyIndex" v-model="mudVol">
                                <label for="mudVolume" class="form-label">Volume of Mud</label>
                            </div>
                            <div class="unit ms-3">
                                <select @change="mudVolConv" v-model="mudVolUnit" class="form-select border-info">
                                    <option>bbls</option>
                                    <option>cu.ft</option>
                                    <option>cu.m</option>
                                    <option>gal</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div class="required">
                        <p class="fw-semibold">Required Mud Properties</p>
                        <!-- Oil % -->
                        <div class="d-flex mt-3 align-items-center">
                            <div class="form-floating">
                                <input @change="requirement, autoWater" class="form-control" type="number" min="0" id="newOilPercent" step="1" placeholder="%ofOil" v-model="newOilPercent">
                                <label for="newOilPercent" class="form-label">Required % of Oil</label>
                            </div>
                            <span class="align-baseline text-secondary fs-6 ms-3">%</span>
                        </div>

                        <!-- Water % -->
                        <div class="d-flex mt-3 align-items-center">
                            <div class="form-floating">
                                <input @change="requirement, autoOil" class="form-control" type="number" min="0" id="newWaterPercent" step="1" placeholder="%ofWater" v-model="newWaterPercent">
                                <label for="newWaterPercent" class="form-label">Required % of Water</label>
                            </div>
                            <span class="align-baseline text-secondary fs-6 ms-3">%</span>
                        </div>
                    </div>
                
                </div>

            </div>

            <div class="outputs">
                <div class="neutral" v-if="neutral">
                    <p class="text-break w-75">Enter the existing volume % of Oil and Water in the current mud and the required Oil and Water %.</p> 
                    <p class="text-break w-75">Based on the requirement OWR, the volume of oil or water to be added to the mud will be calculated.</p>
                </div>
                <div v-else>
                    <p class="text-secondary fw-medium">Requirement: <span class="fs-4 text-success fw-semibold">{{ increaseOWR ? 'Increase OWR' : 'Decrease OWR' }}</span></p>
                </div>
                
                <div class="lp-height d-flex align-items-end">
                    <div v-if="decreaseOWR">
                        <div class="lp-height-out">
                            <span class="text-secondary text-uppercase fs-6">Volume of Water to Add</span>
                            <h3 class="text-center text-success">{{ addWater.toFixed(0) }} {{ mudVolUnit }}</h3>
                        </div>
                    </div>

                    <div v-else>
                        <div class="lp-height-out">
                            <span class="text-secondary text-uppercase fs-6">Volume of Oil to Add</span>
                            <h3 class="text-center text-success">{{ addWater.toFixed(0) }} {{ mudVolUnit }}</h3>
                        </div>
                    </div>
                    
                </div>
            </div>
        </div>
    </div>


</template>