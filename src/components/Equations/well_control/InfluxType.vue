<script setup>
import { ref, computed } from 'vue';
import store from '@/store'

// Data
const SIDP = ref('')
const SICP = ref('')
const influxHeight = ref('')

// Units
const SIDPUnits = ref('psi')
const SICPUnits = ref('psi')
const influxHeightUnits = ref('ft')

// Conversions
const sidpConv = computed(() => {
    if (SIDPUnits.value == 'psi') {
        SIDP.value = (SIDP.value * 0.145).toFixed(0)
    } else {
        SIDP.value = (SIDP.value / 0.145).toFixed(0)
    }
})

const sicpConv = computed(() => {
    if (SICPUnits.value == 'psi') {
        SICP.value = (SICP.value * 0.145).toFixed(0)
    } else {
        SICP.value = (SICP.value / 0.145).toFixed(0)
    }
})

const influxHeightConv = computed(() => {
    if (influxHeightUnits.value == 'ft') {
        influxHeight.value = (influxHeight.value * 3.281).toFixed(0)
    } else {
        influxHeight.value = (influxHeight.value / 3.281).toFixed(0)
    }
})

// Calculations
const influxType = computed(() => {
    let mwBaseUnit
    let sidpBaseUnit
    let sicpBaseUnit
    let HiBaseUnit

    if (store.inputUnits.mwUnit == 'g/cc') {
        mwBaseUnit = store.mainInputs.mw * 8.33
    } else {
        mwBaseUnit = store.mainInputs.mw
    }

    if (SIDPUnits.value == 'kPa') {
        sidpBaseUnit = SIDP.value * 0.145
    } else {
        sidpBaseUnit = SIDP.value
    }

    if (SICPUnits.value == 'kPa') {
        sicpBaseUnit = SICP.value * 0.145
    } else {
        sicpBaseUnit = SICP.value
    }

    if (influxHeightUnits.value == 'm') {
        HiBaseUnit = influxHeight.value * 3.281
    } else {
        HiBaseUnit = influxHeight.value
    }

    const influxWeight = mwBaseUnit - ((sicpBaseUnit - sidpBaseUnit) / (HiBaseUnit * 0.052))

    if (influxWeight <3) {
        return 'Gas'
    } else if (influxWeight >= 3 && influxWeight <7) {
        return 'Oil or Gas with Oil'
    } else {
        return 'Water'
    }
})

</script>

<template>
    <div class="d-flex justify-content-between align-items-start">
        <div class="data-show d-flex ms-5 mt-5 align-items-center">
            <div class="inputs">
                <h3 class="fs-5 ms-5">Influx Type</h3>

                <!-- SIDP -->
                <div class="d-flex mt-3 align-items-center">
                    <div class="form-floating">
                        <input class="form-control" type="number" min="0" id="SIDP" step="1" placeholder="SIDP" v-model="SIDP">
                        <label for="SIDP" class="form-label">SIDP</label>
                    </div>
                    <div class="unit ms-3">
                        <select @change="sidpConv" v-model="SIDPUnits" class="form-select border-info">
                            <option>psi</option>
                            <option>kPa</option>
                        </select>
                    </div>
                </div>

                <!-- SICP -->
                <div class="d-flex mt-3 align-items-center">
                    <div class="form-floating">
                        <input class="form-control" type="number" min="0" id="SICP" step="1" placeholder="SICP" v-model="SICP">
                        <label for="SICP" class="form-label">SICP</label>
                    </div>
                    <div class="unit ms-3">
                        <select @change="sicpConv" v-model="SICPUnits" class="form-select border-info">
                            <option>psi</option>
                            <option>kPa</option>
                        </select>
                    </div>
                </div>

                <!-- Influx Height -->
                <div class="d-flex mt-3 align-items-center">
                    <div class="form-floating">
                        <input class="form-control" type="number" min="0" id="Hi" step="1" placeholder="Hi" v-model="influxHeight">
                        <label for="Hi" class="form-label">Influx Height</label>
                    </div>
                    <div class="unit ms-3">
                        <select @change="influxHeightConv" v-model="influxHeightUnits" class="form-select border-info">
                            <option>ft</option>
                            <option>m</option>
                        </select>
                    </div>
                </div>
            </div>

            <div class="outputs ms-5">
                <div class="lp-height d-flex align-items-end">
                    <div class="lp-height-out">
                        <span class="text-secondary text-uppercase fs-6">Influx Type</span>
                        <h3 class="text-center text-success">{{ influxType }}</h3>
                    </div>
                </div>
            </div>

        </div>
    </div>
</template>