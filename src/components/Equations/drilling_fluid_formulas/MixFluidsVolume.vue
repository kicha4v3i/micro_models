<script setup>
import { ref, computed } from 'vue'
import store from '@/store'

// Error Handling
const errMsg = ref('')

// Data
const pitLimit = ref('false')
const mudRow = ref([
    {s_no: 1, mw: ''},
    {s_no: 2, mw: ''}
])
const finalMW = ref('')
const totVol = ref('')

// Units
const mwUnit = ref('ppg')
const finalMWUnit = ref('ppg')
const mudVolUnit = ref('bbls')

// Add Mud Weight Row
const addRow = () => {
    mudRow.value.push({s_no: mudRow.value.length+1, mw: ''})
}

const deleteRow = () => {
    if (mudRow.value.length > 2) {
        mudRow.value.pop()
    }
}

// Conversions
const finalMWConv = computed(() => {
    if (finalMWUnit.value == 'ppg') {
        finalMW.value = (finalMW.value * 8.33).toFixed(2)
    } else {
        finalMW.value = (finalMW.value / 8.33).toFixed(2)
    }
})

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

const mwTableConv = computed(() => {
    if (mwUnit.value == 'ppg') {
        for (let i=0; i<=mudRow.value.length-1; i++) {
            mudRow.value[i]['mw'] = (mudRow.value[i]['mw'] * 8.33).toFixed(2)
        } 
    } else {
        for (let i=0; i<=mudRow.value.length-1; i++) {
            mudRow.value[i]['mw'] = (mudRow.value[i]['mw'] / 8.33).toFixed(2)
        } 
    }
})

// Calculations
const volReq = computed(() => {
    // Base Units
    let mudVolBase
    let finalMWBase
    let mwBase = []

    if (mudVolUnit.value == 'cu.ft') {
        mudVolBase = totVol.value / 5.615
    } else if (mudVolUnit.value == 'cu.m') {
        mudVolBase = mtotVol.value / 0.1589
    } else if (mudVolUnit.value == 'gal') {
        mudVolBase = totVol.value / 42
    } else {
        mudVolBase = totVol.value
    }

    if (finalMWUnit.value == 'ppg') {
        finalMWBase = finalMW.value
    } else {
        finalMWBase = finalMW.value * 8.33
    }

    for (let i=0; i<=mudRow.value.length-1; i++) {
        if (mwUnit.value == 'ppg') {
            mwBase.push(mudRow.value[i]['mw'])
        } else {
            mwBase.push(mudRow.value[i]['mw'] * 8.33)
        }
    }

    if (pitLimit) {

    }
})

</script>
<template>
    <div class="d-flex justify-content-between align-items-start">
        <div class="data-show d-flex ms-5 mt-5 align-items-start">
            <div class="inputs">
                <!-- With or Without Pit Limits -->
                <!-- Switch for Pit Limit -->
                <div class="form-check form-switch">
                    <input @change="selectMethod" v-model="pitLimit" class="form-check-input hover-pointer button" type="checkbox" role="switch" id="pitLimit">
                    <label class="form-check-label" for="pitLimit">Limited Pit Volume</label>
                </div>

                <!-- Final Mud Weight -->
                <div class="d-flex mt-3 align-items-center">
                    <div class="form-floating">
                        <input class="form-control" type="number" min="0" id="finalMW" step="0.1" placeholder="Final Weight" v-model="finalMW">
                        <label for="finalMW" class="form-label">Final Mud Weight</label>
                    </div>
                    <div class="unit ms-3">
                        <select @change="finalMWConv" v-model="finalMWUnit" class="form-select border-info">
                            <option>ppg</option>
                            <option>g/cc</option>
                        </select>
                    </div>
                </div>

                <!-- Final Volume of Mud -->
                <div class="d-flex mt-3 align-items-center">
                    <div class="form-floating">
                        <input class="form-control" type="number" min="0" id="mudVolume" step="1" placeholder="Mud Volume" v-model="totVol">
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

                <!-- Table of Mud Weights-->
                <div class="border border-dark-subtle rounded bg-light px-4 py-1 mt-3">
                    <p class="fs-5 fw-medium">Existing MW</p>
                    <div class="table-buttons d-flex justify-content-end mt-3 mb-3">
                        <button @click="addRow" type="button" class="btn btn-success btn-sm me-2" style="--bs-btn-font-size: .75rem;">Add</button>
                        <button @click="deleteRow" type="button" class="btn btn-danger btn-sm" :class="{ disabled: mudRow.length==2 }" style="--bs-btn-font-size: .75rem;">Delete</button>
                    </div>
                    
                    <table class="table table-hover table-light">
                        <thead>
                            <tr>
                                <th class="text-center fw-semibold text-secondary">#</th>
                                <th class="text-center fw-semibold text-secondary">Mud Weight <select @change="mwTableConv" v-model="mwUnit">
                                <option>ppg</option>
                                <option>g/cc</option>
                            </select></th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="item in mudRow">
                                <td class="text-center">{{ item.s_no }}</td>
                                <td><input class="form-control form-control-sm" v-model="item.mw"></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                {{ pitLimit }}
            </div>
        </div>
    </div>
</template>

<style scoped>
.button:hover {
    cursor: pointer;
}
</style>