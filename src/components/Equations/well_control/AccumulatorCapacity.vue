<script setup>
import { ref, computed } from 'vue'
import store from '@/store'

// Data
const useVol = ref('')
const preChargePress = ref('')
const minSysPress = ref('')
const opsPress = ref('')

// Units
const volUseUnit = ref('gal')
const minSysPressUnit = ref('psi')
const preChargeUnit = ref('psi')
const opsPressUnit = ref('psi')
const volPerBotUnit = ref('gal')

// Conversions
let prevuseVol = 'gal'
const volUseConv = computed(() => {
    if (prevuseVol == 'bbls') {
        if (volUseUnit.value == 'gal') {
            useVol.value = (useVol.value * 42).toFixed(1)
            prevuseVol = 'gal'
        } else if (volUseUnit.value == 'cu.m') {
            useVol.value = (useVol.value * 0.1589).toFixed(3)
            prevuseVol = 'cu.m'
        } else {
            useVol.value = (useVol.value * 5.615).toFixed(3)
            prevuseVol = 'cu.ft'
        }
    } else if (prevuseVol == 'gal') {
        if (volUseUnit.value == 'bbls') {
            useVol.value = (useVol.value / 42).toFixed(3)
            prevuseVol = 'bbls'
        } else if (volUseUnit.value == 'cu.m') {
            useVol.value = (useVol.value * 0.00378).toFixed(3)
            prevuseVol = 'cu.m'
        } else {
            useVol.value = (useVol.value * 0.13368).toFixed(3)
            prevuseVol = 'cu.ft'
        }
    } else if (prevuseVol == 'cu.m') {
        if (volUseUnit.value == 'bbls') {
            useVol.value = (useVol.value / 0.1589).toFixed(1)
            prevuseVol = 'bbls'
        } else if (volUseUnit.value == 'gal') {
            useVol.value = (useVol.value / 0.00378).toFixed(1)
            prevuseVol = 'gal'
        } else {
            useVol.value = (useVol.value * 35.3147).toFixed(3)
            prevuseVol = 'cu.ft'
        }
    } else {
        if (volUseUnit.value == 'bbls') {
            useVol.value = (useVol.value /5.615).toFixed(1)
            prevuseVol = 'bbls'
        } else if (volUseUnit.value == 'gal') {
            useVol.value = (useVol.value / 0.13368).toFixed(1)
            prevuseVol = 'gal'
        } else {
            useVol.value = (useVol.value / 35.3147).toFixed(3)
            prevuseVol = 'cu.m'
        }
    }
})

const preChargeConv = computed(() => {
    if (preChargeUnit.value == 'psi') {
        preChargePress.value = (preChargePress.value * 0.145).toFixed(0)
    } else {
        preChargePress.value = (preChargePress.value / 0.145).toFixed(0)
    }
})

const minSysPressConv = computed(() => {
    if (minSysPressUnit.value == 'psi') {
        minSysPress.value = (minSysPress.value * 0.145).toFixed(0)
    } else {
        minSysPress.value = (minSysPress.value / 0.145).toFixed(0)
    }
})

const opsPressConv = computed(() => {
    if (opsPressUnit.value == 'psi') {
        opsPress.value = (opsPress.value * 0.145).toFixed(0)
    } else {
        opsPress.value = (opsPress.value / 0.145).toFixed(0)
    }
})

// Calculations
const volPerBot = computed(() => {
    // Base Unit
    let useVolBase
    let preChargeBase
    let minSysBase
    let opsPressBase

    if (volUseUnit.value == 'gal') {
        useVolBase = useVol.value 
    } else if (volUseUnit.value == 'cu.m') {
        useVolBase = useVol.value * 0.00378
    } else if (volUseUnit.value == 'cu.ft') {
        useVolBase = useVol.value * 0.133681
    } else {
        useVolBase = useVol.value * 42
    }

    if (preChargeUnit.value == 'kPa') {
        preChargeBase = preChargePress.value * 0.145
    } else {
        preChargeBase = preChargePress.value
    }

    if (minSysPressUnit.value == 'kPa') {
        minSysBase = minSysPress.value * 0.145
    } else {
        minSysBase = minSysPress.value
    }

    if (opsPressUnit.value == 'kPa') {
        opsPressBase = opsPress.value * 0.145
    } else {
        opsPressBase = opsPress.value
    }

    //Pre-charge to Min Pressure
    let V2 = preChargeBase * useVolBase / minSysBase

    // Pre-charge to Operating Pressure
    let V3 = preChargeBase * useVolBase / opsPressBase

    // Usable Volume
    if (volPerBotUnit.value == 'gal') {
        return (V2 - V3).toFixed(2)
    } else if (volPerBotUnit.value == 'cu.m') {
        return ((V2 - V3) * 0.00378).toFixed(2)
    } else if (volPerBotUnit.value == 'cu.ft') {
        return ((V2 - V3) * 0.133681).toFixed(2)
    } else {
        return ((V2 - V3) / 42).toFixed(2)
    }

})

</script>

<template>
 <div class="d-flex justify-content-between align-items-start">
        <div class="data-show d-flex ms-5 mt-5 align-items-center">
            <div class="inputs">
                <h3 class="fs-5">Accumulator Capacity</h3>

                <!-- Volume of Usable Fluid -->
                <div class="d-flex mt-3 align-items-center">
                    <div class="form-floating">
                        <input class="form-control" type="number" min="0" id="volUse" step="1" placeholder="Usable Fluid" v-model="useVol">
                        <label for="useVol" class="form-label">Volume of Usable Fluid</label>
                    </div>
                    <div class="unit ms-3">
                        <select @change="volUseConv" v-model="volUseUnit" class="form-select border-info">
                            <option>gal</option>
                            <option>bbls</option>
                            <option>cu.m</option>
                            <option>cu.ft</option>
                        </select>
                    </div>
                </div>

                <!-- Pre-Charge Pressure -->
                <div class="d-flex mt-3 align-items-center">
                    <div class="form-floating">
                        <input class="form-control" type="number" min="0" id="preChargePress" step="1" placeholder="Pre-charge Pressure" v-model="preChargePress">
                        <label for="preChargePress" class="form-label">Pre-charge Pressure</label>
                    </div>
                    <div class="unit ms-3">
                        <select @change="preChargeConv" v-model="preChargeUnit" class="form-select border-info">
                            <option>psi</option>
                            <option>kPa</option>
                        </select>
                    </div>
                </div>

                <!-- Minimum System Pressure -->
                <div class="d-flex mt-3 align-items-center">
                    <div class="form-floating">
                        <input class="form-control" type="number" min="0" id="minSysPress" step="1" placeholder="minSysPress" v-model="minSysPress">
                        <label for="minSysPress" class="form-label">Min System Pressure</label>
                    </div>
                    <div class="unit ms-3">
                        <select @change="minSysPressConv" v-model="minSysPressUnit" class="form-select border-info">
                            <option>psi</option>
                            <option>kPa</option>
                        </select>
                    </div>
                </div>

                <!-- Operating Pressure -->
                <div class="d-flex mt-3 align-items-center">
                    <div class="form-floating">
                        <input class="form-control" type="number" min="0" id="opsPress" step="1" placeholder="opsPress" v-model="opsPress">
                        <label for="opsPress" class="form-label">Operating Pressure</label>
                    </div>
                    <div class="unit ms-3">
                        <select @change="opsPressConv" v-model="opsPressUnit" class="form-select border-info">
                            <option>psi</option>
                            <option>kPa</option>
                        </select>
                    </div>
                </div>

            </div>
            <div class="outputs ms-5">
                <div class="lp-height d-flex align-items-end">
                    <div class="lp-height-out">
                        <span class="text-secondary text-uppercase fs-6">Usable Volume per Bottle</span>
                        <h3 class="text-center text-success">{{ volPerBot }}</h3>
                    </div>
                    <div class="lp-height-unit">
                        <span>
                            <select class="form-select" v-model="volPerBotUnit">
                                <option>gal</option>
                                <option>bbls</option>
                                <option>cu.m</option>
                                <option>cu.ft</option>
                            </select>
                        </span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>