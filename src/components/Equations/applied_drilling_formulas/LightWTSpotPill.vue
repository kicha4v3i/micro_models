<script setup>
import { ref, computed } from 'vue'
import store from '@/store'

// Data
const tvd = ref('')

const formPress = ref('')
const overbalance = ref('')
const weightLightPill = ref('')

// Units
const tvd_unit = ref('ft')
const mw_unit = ref('ppg')
const fp_unit = ref('ppg')
const ob_unit = ref('psi')
const wlp_unit = ref('ppg')
const mw_conv_val = ref('')
const fp_conv_val = ref('')
const lp_height_unit = ref('ft')

// Unit Conversions
const tvd_unit_conv = computed(() => {
    
    if (tvd_unit.value == 'ft') {
        tvd.value = (tvd.value * 3.281).toFixed(0)

    } else {
        tvd.value = (tvd.value / 3.281).toFixed(0)
    }
})

const ppg_gcc = (unit, value) => {
    //Convert g/cc to pgg
    if (unit == 'ppg') {
        return value * 8.33
    } 
    //Convert pgg to g/cc
    else {
        return value / 8.33
    }
}

const psi_kPa = (unit, value) => {
    // Convert psi to kPa
    if (unit == 'kPa') {
        return value / 0.000145038 / 1000
    }
    // Convert kPa to psi
    else {
        return value * 1000 * 0.000145038
    }
}

// Formation Pressure Conversion
const fp_unit_conv = computed(() => {
    formPress.value = fp_conv_val.value
    if (fp_unit.value == 'ppg') {
        fp_conv_val.value = (formPress.value * 8.33).toFixed(2)
    } else {
        fp_conv_val.value = (formPress.value / 8.33).toFixed(2)
    }
})

//Overbalance Conversion
const ob_conv = computed(() => {
    if (ob_unit.value == 'kPa') {
        overbalance.value = (overbalance.value / 0.000145038 / 1000).toFixed(0)
    } else {
        overbalance.value = (overbalance.value * 0.000145038 * 1000).toFixed(0)
    }
})

// Calculations
/* Overbalance */

/* Light Pill Weight */
const height_lp = computed(() => {
    
    let mw_base
    let wlp_base

    // MW base unit
    if (store.mwUnit == 'g/cc') {
        mw_base = store.mainInputs.mw * 8.33
    } else {
        mw_base = store.mainInputs.mw
    }

    // FP base unit
    if (wlp_unit.value == 'g/cc') {
        wlp_base = weightLightPill.value * 8.33
    } else {
        wlp_base = weightLightPill.value
    }

    //Overbalance base
    let ob_base
    if (ob_unit.value == 'kPa') {
        ob_base = overbalance.value * 1000 * 0.000145038
    } else {
        ob_base = overbalance.value
    }

    // Difference in pressure
    let dP = (mw_base - wlp_base) * 0.052

    //Height
    if (lp_height_unit.value == 'ft') {
        return (ob_base / dP).toFixed(0)
    } else {
        return ((ob_base / dP) / 3.281).toFixed(0)
    }
    

})

</script>

<template>
    <div class="d-flex justify-content-between align-items-start">
        
        <div class="data-show d-flex ms-5 mt-5 align-items-center">
            
            <div class="inputs">
                
                <div class="d-flex mt-3 align-items-center">
                    
                    <div class="form-floating">
                        <input class="form-control" type="number" min="0" id="tvdi" placeholder="tvdi" v-model="tvd">
                        <label for="tvdi" class="form-label">TVD of Interest</label>
                    </div>
                    <div class="unit ms-3">
                        <select @change="tvd_unit_conv" v-model="tvd_unit" class="form-select border-info">
                            <option>ft</option>
                            <option>m</option>
                        </select>
                    </div>
                </div>

                <div class="d-flex mt-3 align-items-center">
                    <div class="form-floating">
                        <input class="form-control" type="number" min="0" id="form-pressure" placeholder="formation-pressure" v-model="fp_conv_val">
                        <label for="form-pressure" class="form-label">Formation Pressure</label>
                    </div>
                    <div class="unit ms-3">
                        <select @change="fp_unit_conv" v-model="fp_unit" class="form-select border-info">
                            <option>ppg</option>
                            <option>g/cc</option>
                        </select>
                    </div>
                </div>

                <div class="d-flex mt-3 align-items-center">
                    <div class="form-floating">
                        <input class="form-control" type="number" min="0" id="overbalance" placeholder="overbalance" v-model="overbalance">
                        <label for="overbalance" class="form-label">Overbalance</label>
                    </div>
                    <div class="unit ms-3">
                        <select @change="ob_conv" v-model="ob_unit" class="form-select border-info">
                            <option>psi</option>
                            <option>kPa</option>
                        </select>
                    </div>
                </div>

                <div class="d-flex mt-3 align-items-center">
                    <div class="form-floating">
                        <input class="form-control" type="number" min="0" id="light-weight-pill" placeholder="weight-light-pill" v-model="weightLightPill">
                        <label for="light-weight-pill" class="form-label">Weight of Light Weight Pill</label>
                    </div>
                    <div class="unit ms-3">
                        <select v-model="wlp_unit" class="form-select border-info">
                            <option>ppg</option>
                            <option>g/cc</option>
                        </select>
                    </div>
                </div>
            </div>

            <div class="outputs ms-5">
                <div class="lp-height d-flex align-items-end">
                    <div class="lp-height-out">
                        <span class="text-secondary text-uppercase fs-6">Height of Pill</span>
                        <h3 class="text-center text-success">{{ height_lp }}</h3>
                    </div>
                    <div class="lp-height-unit">
                        <span>
                            <select class="form-select" v-model="lp_height_unit">
                                <option>ft</option>
                                <option>m</option>
                            </select>
                        </span>
                    </div>
                </div>
            </div>
        </div>
        <div>

        </div>
    </div>
</template>

<style scoped>
.inputs input {
    width: 250px;
}
</style>
