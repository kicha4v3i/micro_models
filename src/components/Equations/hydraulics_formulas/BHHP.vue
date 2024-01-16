<script setup>
import { ref, computed } from 'vue'
import store from '@/store'
// Data
const dPBit = ref('')

// Units
const dPBitUnit = ref('psi')

// Conversion
const dPConv = computed(() => {
    if (dPBitUnit.value == 'psi') {
        dPBit.value = (dPBit.value * 0.145).toFixed(0)
    } else {
        dPBit.value = (dPBit.value / 0.145).toFixed(0)
    }
})

// Calculations
const BHHP = computed(() => {
    let qBaseUnit
    let dPBitBase
    if (store.flowrateUnit == 'lpm') {
        qBaseUnit = store.mainInputs.flowrateConv('gpm')
    } else {
        qBaseUnit = store.mainInputs.flowrate
    }

    if (dPBitUnit.value == 'kPa') {
        dPBitBase = dPBit.value * 0.145
    } else {
        dPBitBase = dPBit.value
    }

    return (qBaseUnit * dPBitBase / 1714).toFixed(0)
})

</script>

<template>
    <div class="d-flex justify-content-between align-items-start">
        <div class="data-show d-flex ms-5 mt-5 align-items-start justify-content-end">
            <div class="inputs">

                <div class="d-flex mt-3 align-items-center">
                    <div class="form-floating">
                        <input class="form-control" type="number" min="0" id="tdPBit" step="1" placeholder="dPBit" v-model="dPBit">
                        <label for="dPBit" class="form-label">Bit Pressure Loss</label>
                    </div>
                    <div class="unit ms-3">
                        <select @change="dPConv" v-model="dPBitUnit" class="form-select border-info">
                            <option>psi</option>
                            <option>kPa</option>
                        </select>
                    </div>
                </div>
            </div>

            <div class="outputs ms-5 mt-3">
                <div class="lp-height d-flex align-items-end">
                    <div class="lp-height-out">
                        <span class="text-secondary text-uppercase fs-6">BHHP</span>
                        <h3 class="text-center text-success">{{ BHHP }}<span class="align-baseline text-secondary fs-6"> hp</span></h3>
                    </div>
                </div>
            </div>

        </div>
    </div>
</template>

<style scoped>
.inputs {
    width: 36vw;
}
</style>
