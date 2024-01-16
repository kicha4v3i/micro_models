<script setup>
import store from '../store/index.js'
import { ref, computed } from 'vue'

// Import Components
/* Applied Drilling Formulas */
import DrillCollarWeight from './Equations/applied_drilling_formulas/DrillCollarWeight.vue'
import LightWeightSpotPill from './Equations/applied_drilling_formulas/LightWTSpotPill.vue'
import MOP from './Equations/applied_drilling_formulas/MOP.vue'
import mROP from './Equations/applied_drilling_formulas/mROP.vue'
import pipeElong from './Equations/applied_drilling_formulas/pipeElong.vue'
import pressBreak from './Equations/applied_drilling_formulas/pressBreak.vue'
import stuckPipe from './Equations/applied_drilling_formulas/stuckPipe.vue'
import tonMiles from './Equations/applied_drilling_formulas/tonMiles.vue'
import cuttingsVol from './Equations/applied_drilling_formulas/cuttingsVol.vue'

/* Directional Drilling Formulas */
import Survey from './Equations/directional_drilling/Survey.vue'
import DLS from './Equations/directional_drilling/DLS.vue'

/* Drilling Fluid Formulas */
import CuttingsBulkDensity from './Equations/drilling_fluid_formulas/CuttingsBulkDensity.vue'
import DetermineOWR from './Equations/drilling_fluid_formulas/DetermineOWR.vue'
import DilutionLGS from './Equations/drilling_fluid_formulas/DilutionLGS.vue'
import IncreaseMW from './Equations/drilling_fluid_formulas/IncreaseMW.vue'
import IncreaseOWR from './Equations/drilling_fluid_formulas/IncreaseOWR.vue'
import MixFluidsVolume from './Equations/drilling_fluid_formulas/MixFluidsVolume.vue'
import PVYP from './Equations/drilling_fluid_formulas/PVYP.vue'
import ReduceMW from './Equations/drilling_fluid_formulas/ReduceMW.vue'
import SolidDensity from './Equations/drilling_fluid_formulas/SolidDensity.vue'
import DecreaseOWR from './Equations/drilling_fluid_formulas/DecreaseOWR.vue'
import DensityOWM from './Equations/drilling_fluid_formulas/DensityOWM.vue'

/* Hydraulics Formulas */
import bitNozzleVel from './Equations/hydraulics_formulas/bitNozzleVel.vue'
import BHHP from './Equations/hydraulics_formulas/BHHP.vue'
import CCI from './Equations/hydraulics_formulas/CCI.vue'
import CFV from './Equations/hydraulics_formulas/CFV.vue'
import CriticalFlowrate from './Equations/hydraulics_formulas/CriticalFlowrate.vue'
import dPBit from './Equations/hydraulics_formulas/dPBit.vue'
import EffectiveViscosity from './Equations/hydraulics_formulas/EffectiveViscosity.vue'
import ImpactForce from './Equations/hydraulics_formulas/ImpactForce.vue'
import MinQPDC from './Equations/hydraulics_formulas/MinQPDC.vue'
import MSE from './Equations/hydraulics_formulas/MSE.vue'
import SlipVelocity from './Equations/hydraulics_formulas/SlipVelocity.vue'
import SurgeAndSwab from './Equations/hydraulics_formulas/SurgeAndSwab.vue'
import TFA from './Equations/hydraulics_formulas/TFA.vue'
import FrictionLosses from './Equations/hydraulics_formulas/FrictionLosses.vue'

/* Well Control Formulas */
import GasMigrationRate from './Equations/well_control/GasMigrationRate.vue'
import InfluxType from './Equations/well_control/InfluxType.vue'
import KTF from './Equations/well_control/KTF.vue'
import GasDensity from './Equations/well_control/GasDensity.vue'
import MaxFormPress from './Equations/well_control/MaxFormPress.vue'
import InfluxHeight from './Equations/well_control/InfluxHeight.vue'
import CompressibilityFactor from './Equations/well_control/CompressibilityFactor.vue'
import TripMargin from './Equations/well_control/TripMargin.vue'
import MaxPitGain from './Equations/well_control/MaxPitGain.vue'
import MaxSurfacePress from './Equations/well_control/MaxSurfacePress.vue'
import AccumulatorCapacity from './Equations/well_control/AccumulatorCapacity.vue'


const dcw = computed(() => {
    return store.state.DCW
}) 
const displayDCW = () => {
    store.methods.setDCW()
}

// Tabs Open
const adfTabActive = ref(false)
const hydTabActive = ref(false)
const hydTabInactive = ref(true)
const wcTabActive = ref(false)

// Current Tab Declaration
const currentTab = ref('')

const activateAdfTab = (tab) => {
    currentTab.value = tab
    store.hydTab.activeTab = null
    store.adfTab.activeTab = adfTabs[tab]
    store.wcTab.activeTab = null
}

const activateDdTab = (tab) => {
    currentTab.value = tab
    store.hydTab.activeTab = null
    store.ddTab.activeTab = ddTabs[tab]
    store.adfTab.activeTab = null
    store.wcTab.activeTab = null
}

const activateDfTab = (tab) => {
    currentTab.value = tab
    store.hydTab.activeTab = null
    store.ddTab.activeTab = null
    store.dfTab.activeTab = dfTabs[tab]
    store.adfTab.activeTab = null
    store.wcTab.activeTab = null
}

const activateHydTab = (tab) => {
    currentTab.value = tab
    store.adfTab.activeTab = null
    store.hydTab.activeTab = hydTabs[tab]
    store.wcTab.activeTab = null
    console.log('before', hydTabActive.value)
    hydTabActive.value = true
    hydTabInactive.value = false
    console.log('after', hydTabActive.value)
}

const activateWCTab = (tab) => {
    currentTab.value = tab
    store.adfTab.activeTab = null
    store.hydTab.activeTab = null
    store.wcTab.activeTab = wcTabs[tab]
    wcTabActive.value = true
}

// Navigation Tabs
const adfTabs = {
    'Drill Collar Weight': DrillCollarWeight,
    'Light Weight Spot Pill': LightWeightSpotPill,
    'Margin of Overpull': MOP,
    'Max ROP': mROP,
    'Pipe Elongation due to Temperature': pipeElong,
    'Pressure required to break circulation': pressBreak,
    'Stuck Pipe Calculation': stuckPipe,
    'Ton Miles Calculation': tonMiles,
    'Volume of cuttings generated': cuttingsVol,
}

const ddTabs = {
    'Survey': Survey,
    'DLS': DLS
}

const dfTabs = {
    'Cuttings Bulk Density': CuttingsBulkDensity,
    'Determine OWR': DetermineOWR,
    'OWR Calculations': DecreaseOWR,
    'Increase OWR': IncreaseOWR,
    'Density of Oil Water Mixture': DensityOWM,
    'Dilution for LGS': DilutionLGS,
    'Increase MW': IncreaseMW,
    'Mix Fluids Volume': MixFluidsVolume,
    'PV & YP': PVYP,
    'Reduce MW': ReduceMW,
    'Solid Density from Retort': SolidDensity
}

const hydTabs = {
    'Bit Nozzle Velocity': bitNozzleVel,
    'Bit Hydraulic Horsepower': BHHP,
    'Impact Force': ImpactForce,
    'Critical Flowrate': CriticalFlowrate,
    'Crossflow Velocity under Drillbit': CFV,
    'Cuttings Carrying Capacity': CCI,
    'Cuttings Slip Velocity': SlipVelocity,
    'Effective Viscosity': EffectiveViscosity,
    'Frictional Losses': FrictionLosses,
    'Mechanical Specific Energy': MSE,
    'Min Flowrate for PDC Bit': MinQPDC,
    'Pressure Drop Across Bit': dPBit,
    'Surge and Swab': SurgeAndSwab,
    'Total Nozzle Flow Area': TFA
}

const wcTabs = {
    'Gas Migration Rate': GasMigrationRate,
    'Influx Type': InfluxType,
    'Kick Tolerance Factor': KTF,
    'Gas Density': GasDensity,
    'Maximum Formation Pressure': MaxFormPress,
    'Influx Height': InfluxHeight,
    'Gas Compressibility Factor': CompressibilityFactor,
    'Trip Margin': TripMargin,
    'Max Pit Gain from Gas Kick with WBM': MaxPitGain,
    'Max Surface Pressure from Gas Kick with WBM': MaxSurfacePress,
    'Accumulator Capacity': AccumulatorCapacity
}

</script>

<template>
    <aside>
        <div class="applied-drilling accordion accordion-flush" id="f-list">
            <!-- Applied Drilling Formulas -->
            <div class="accordion-item">
                <p class="accordion-header" data-bs-toggle="collapse" data-bs-target="#adf-list"><a href="#">Applied Drilling Formulas</a></p>
                <div id="adf-list" class="accordion-collapse collapse" :class="{ show: adfTabActive }" data-bs-parent="#f-list">
                    
                    <!-- Dynamic Applied Drilling Formuals Components -->
                    <ul class="list-items">
                        <li v-for="(_, tab) in adfTabs" :key="tab" class="text-white" :class="{ active: currentTab == tab }" @click="activateAdfTab(tab)"><router-link :to="{name: 'adf'}">{{ tab }}</router-link></li>
                    </ul>
                
                </div>
            </div>

            <!-- Directional Drilling Formulas -->
            <div class="accordion-item">
                <p class="accordion-header" data-bs-toggle="collapse" data-bs-target="#dd-list"><a href="#">Directional Drilling Formulas</a></p>
                <div id="dd-list" class="accordion-collapse collapse" data-bs-parent="#f-list">
                    
                    <!-- Dynamic Directional Drilling Formuals Components -->
                    <ul class="list-items">
                        <li v-for="(_, tab) in ddTabs" :key="tab" class="text-white" :class="{ active: currentTab == tab }" @click="activateDdTab(tab)"><router-link :to="{name: 'dd'}">{{ tab }}</router-link></li>
                    </ul>
                
                </div>
            </div>

            <!-- Drilling Fluid Formulas -->
            <div class="accordion-item">
                <p class="accordion-header" data-bs-toggle="collapse" data-bs-target="#df-list"><a href="#">Drilling Fluid Formulas</a></p>
                <div id="df-list" class="accordion-collapse collapse" data-bs-parent="#f-list">
                    
                    <!-- Dynamic Drilling Fluid Formuals Components -->
                    <ul class="list-items">
                        <li v-for="(_, tab) in dfTabs" :key="tab" class="text-white" :class="{ active: currentTab == tab }" @click="activateDfTab(tab)"><router-link :to="{name: 'df'}">{{ tab }}</router-link></li>
                    </ul>
                
                </div>
            </div>
            
            <!-- Hydraulics Formulas -->
            <div class="accordion-item">
                <p class="accordion-header" data-bs-toggle="collapse" data-bs-target="#hyd-list"><a href="#">Hydraulics Formulas</a></p>
                <div id="hyd-list" class="accordion-collapse" :class="{ open: hydTabActive, collapse: hydTabInactive }" data-bs-parent="#f-list">

                    <!-- Dynamic Hydraulics Components -->
                    <ul class="list-items">
                        <li v-for="(_, tab) in hydTabs" :key="tab"  class="text-white" :class="{ active: currentTab == tab }" @click="activateHydTab(tab)"><router-link :to="{name: 'hyd'}">{{ tab }}</router-link></li>
                    </ul>

                </div>
            </div>

            <!-- Well Control Formulas -->
            <div class="accordion-item">
                <p class="accordion-header" data-bs-toggle="collapse" data-bs-target="#wc-list"><a href="#">Well Control Formulas</a></p>
                <div id="wc-list" class="accordion-collapse collapse" :class="{ show: wcTabActive }" data-bs-parent="#f-list">

                    <!-- Dynamic Hydraulics Components -->
                    <ul class="list-items">
                        <li v-for="(_, tab) in wcTabs" :key="tab" class="text-white" :class="{ active: currentTab == tab }" @click="activateWCTab(tab), wcTabActive = true"><router-link :to="{name: 'wc'}">{{ tab }}</router-link></li>
                    </ul>

                </div>
            </div>
            
        </div>
    </aside>
</template>

<style scoped>
aside {
    width: 230px;
    padding-left: 10px;
    padding-right: 50px;
    padding-bottom: 20px;
    padding-top: 20px;
    background: rgb(247, 247, 247);
    height: 93vh;
}

.accordion-item {
    background: none;
    width: 200px;
}

.accordion-item a {
    text-decoration: none;
    color: rgb(84, 84, 84) !important;
}

.accordion-item ul {
    list-style: none;
}

.accordion-item ul li {
    padding: 5px 0px;
    font-weight: 500;
    font-size: 12px;
}

.accordion-item ul li.active a{
    font-weight: 600;
    margin-left: 5px;
}

.accordion-item ul li a:hover {
    font-weight: 600;
}

.accordion-item ul li a {
    font-weight: 500;
}

.list-items li a .something {
    font-weight: 600;
}

.accordion-header {
    margin: 5px 10px;

}
.accordion-header {
    font-weight: 500;
    font-size: 10px;
    padding-bottom: 2px;

}

.header-item:hover {
    font-weight: 500;
}

</style>