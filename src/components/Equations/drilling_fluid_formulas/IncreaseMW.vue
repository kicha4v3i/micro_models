<script setup>
import { ref, computed } from 'vue'
import store from '@/store'

// Data
const mudVol = ref('')
const newMW = ref('')

// Select Weighting Material
const weightingMaterial = ref('barite')

// Units
const mudVolUnit = ref('bbls')
const newMWUnit = ref('ppg')

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

const newMWConv = computed(() => {
    if (newMWUnit.value == 'ppg') {
        newMW.value = newMW.value * 8.33
    } else {
        newMW.value = newMW.value / 8.33 
    }
})

// Calculations
const sacks = computed(() => {
    // Base Units
    let mudVolBase
    let newMWBase
    let mwBase

    if (mudVolUnit.value == 'cu.ft') {
        mudVolBase = mudVol.value / 5.615
    } else if (mudVolUnit.value == 'cu.m') {
        mudVolBase = mudVol.value / 0.1589
    } else if (mudVolUnit.value == 'gal') {
        mudVolBase = mudVol.value / 42
    } else {
        mudVolBase = mudVol.value
    }

    if (newMWUnit.value == 'ppg') {
        newMWBase = newMW.value
    } else {
        newMWBase = newMW.value * 8.33
    }

    if (store.inputUnits.mwUnit == 'ppg') {
        mwBase = store.mainInputs.mw
    } else {
        mwBase = store.mainInputs.mw * 8.33
    }

    if (weightingMaterial.value == 'barite') {
        return (1470 * (newMWBase - mwBase) / (35 - newMWBase)) * mudVolBase / 100
    } else if (weightingMaterial.value == 'caco3') {
        return (945 * (newMWBase - mwBase) / (22.5 - newMWBase)) * mudVolBase / 100
    } else {
        return (1680 * (newMWBase - mwBase) / (40 - newMWBase)) * mudVolBase / 100
    }
})

const volIncrease = computed(() => {
    // Base Units
    let mudVolBase
    let newMWBase
    let mwBase

    if (mudVolUnit.value == 'cu.ft') {
        mudVolBase = mudVol.value / 5.615
    } else if (mudVolUnit.value == 'cu.m') {
        mudVolBase = mudVol.value / 0.1589
    } else if (mudVolUnit.value == 'gal') {
        mudVolBase = mudVol.value / 42
    } else {
        mudVolBase = mudVol.value
    }

    if (newMWUnit.value == 'ppg') {
        newMWBase = newMW.value
    } else {
        newMWBase = newMW.value * 8.33
    }

    if (store.inputUnits.mwUnit == 'ppg') {
        mwBase = store.mainInputs.mw
    } else {
        mwBase = store.mainInputs.mw * 8.33
    }

    // Calculations
    if (weightingMaterial.value == 'barite') {
        if (mudVolUnit.value == 'bbls') {
            return 100 * (newMWBase - mwBase) / (35 - newMWBase) * mudVolBase / 100
        } else if (mudVolUnit.value == 'gal') {
            return (100 * (newMWBase - mwBase) / (35 - newMWBase) * mudVolBase / 100) * 42
        } else if (mudVolUnit.value == 'cu.ft') {
            return (100 * (newMWBase - mwBase) / (35 - newMWBase) * mudVolBase / 100) * 5.615
        } else {
            return (100 * (newMWBase - mwBase) / (35 - newMWBase) * mudVolBase / 100) * 0.1589
        }
    } else if (weightingMaterial.value == 'caco3') {
        if (mudVolUnit.value == 'bbls') {
            return 100 * (newMWBase - mwBase) / (22.5 - newMWBase) * mudVolBase / 100
        } else if (mudVolUnit.value == 'gal') {
            return (100 * (newMWBase - mwBase) / (22.5 - newMWBase) * mudVolBase / 100) * 42
        } else if (mudVolUnit.value == 'cu.ft') {
            return (100 * (newMWBase - mwBase) / (22.5 - newMWBase) * mudVolBase / 100) * 5.615
        } else {
            return (100 * (newMWBase - mwBase) / (22.5 - newMWBase) * mudVolBase / 100) * 0.1589
        }
    } else {
        if (mudVolUnit.value == 'bbls') {
            return 100 * (newMWBase - mwBase) / (40 - newMWBase) * mudVolBase / 100
        } else if (mudVolUnit.value == 'gal') {
            return (100 * (newMWBase - mwBase) / (40 - newMWBase) * mudVolBase / 100) * 42
        } else if (mudVolUnit.value == 'cu.ft') {
            return (100 * (newMWBase - mwBase) / (40 - newMWBase) * mudVolBase / 100) * 5.615
        } else {
            return (100 * (newMWBase - mwBase) / (40 - newMWBase) * mudVolBase / 100) * 0.1589
        }
    }
})

</script>
<template>
    <div class="d-flex justify-content-between align-items-start">
        <div class="data-show d-flex ms-5 mt-5 align-items-start">
            <div class="inputs">
                <!-- Select Dilution Fluid -->
                <p class="fw-medium">Select Weighting Material</p>
                <div class="form-check">
                    <input @click="selectMethodOne" class="form-check-input" type="radio" name="inputMethod" id="method-1" value="barite" v-model="weightingMaterial" checked>
                    <label class="form-check-label" for="method-1">Barite</label>
                </div>

                <div class="form-check">
                    <input @click="selectMethodTwo" class="form-check-input" type="radio" name="inputMethod" id="method-2" value="caco3" v-model="weightingMaterial">
                    <label class="form-check-label" for="method-2">Calcium Carbonate</label>
                </div>

                <div class="form-check">
                    <input @click="selectMethodTwo" class="form-check-input" type="radio" name="inputMethod" id="method-3" value="hematite" v-model="weightingMaterial">
                    <label class="form-check-label" for="method-3">Hematite</label>
                </div>

                <!-- Volume of Mud -->
                <div class="d-flex mt-3 align-items-center">
                    <div class="form-floating">
                        <input class="form-control" type="number" min="0" id="mudVolume" step="1" placeholder="Mud Volume" v-model="mudVol">
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

                <!-- New Mud Weight -->
                <div class="d-flex mt-3 align-items-center">
                    <div class="form-floating">
                        <input class="form-control" type="number" min="0" id="newMW" step="0.1" placeholder="New Mud Weight" v-model="newMW">
                        <label for="newMW" class="form-label">Required Mud Weight</label>
                    </div>
                    <div class="unit ms-3">
                        <select @change="newMWConv" v-model="newMWUnit" class="form-select border-info">
                            <option>ppg</option>
                            <option>g/cc</option>
                        </select>
                    </div>
                </div>
            </div>

            <div class="outputs ms-5 d-flex flex-column align-items-center">
                <!-- Number of Sacks -->
                <div class="lp-height d-flex align-items-end">
                    <div class="lp-height-out">
                        <span class="text-secondary text-uppercase fs-6">Number of Sacks</span>
                        <h3 class="text-center text-success">{{ Math.ceil(sacks) }}</h3>
                    </div>
                </div>

                <!-- Increase in Volume of Mud -->
                <div class="lp-height d-flex align-items-end mt-3">
                    <div class="lp-height-out">
                        <span class="text-secondary text-uppercase fs-6">Increase in Volume</span>
                        <h3 class="text-center text-success">{{ Math.ceil(volIncrease) }} {{ mudVolUnit }}</h3>
                    </div>
                </div>
                
            </div>
        </div>
    </div>
    
</template>