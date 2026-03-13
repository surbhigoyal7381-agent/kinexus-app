import React, { useState, useMemo } from 'react';

// ROI configuration for common industries (same shape as used previously)
const ROI_CONFIG = {
  manufacturing: {
    // Five focused, high-signal inputs (values entered in Crore where indicated)
    fields: [
      { key: 'annualRevenueCr', label: 'Annual revenue (₹ Crore)', placeholder: '50', unit: 'Cr' },
      { key: 'numMachines', label: 'Number of machines', placeholder: '20' },
      { key: 'monthlyDowntimeHrsPerMachine', label: 'Monthly downtime hours per machine', placeholder: '8', unit: 'h' },
      { key: 'rejectionRatePct', label: 'Rejection rate (%)', placeholder: '3', unit: '%' },
      { key: 'annualProcurementCr', label: 'Annual procurement spend (₹ Crore)', placeholder: '30', unit: 'Cr' },
      { key: 'implementationCostCr', label: 'Estimated implementation cost (one-time, ₹ Crore, optional)', placeholder: '0.5', unit: 'Cr', help: 'Typical for SMEs: ₹0.1–0.8 Cr' },
      { key: 'firstYearSubscriptionCr', label: 'First-year subscription (₹ Crore, optional)', placeholder: '0.1', unit: 'Cr', help: 'Typical SaaS fees: ₹0.02–0.2 Cr/yr' }
    ],
    compute: (v) => {
      // convert Crore -> INR
      const INR_PER_CRORE = 10000000; // 1 Cr = 1e7 INR
      const annualRevenueINR = (isNaN(Number(v.annualRevenueCr)) ? 0 : Number(v.annualRevenueCr)) * INR_PER_CRORE;
      const procurementINR = (isNaN(Number(v.annualProcurementCr)) ? 0 : Number(v.annualProcurementCr)) * INR_PER_CRORE;

      // Machine hours per year (assume 24x365 operation per machine)
      const HOURS_PER_MACHINE_YEAR = 24 * 365; // 8760
      const totalMachineHoursPerYear = (Number(v.numMachines) || 0) * HOURS_PER_MACHINE_YEAR;

      // Downtime savings: use 30% reduction midpoint
      const downtimeReductionPct = 0.30;
      const downtimeHoursPerMachineYear = (Number(v.monthlyDowntimeHrsPerMachine) || 0) * 12;
      // Revenue per machine-hour (using total machine hours across fleet)
      const revenuePerMachineHour = totalMachineHoursPerYear > 0 ? (annualRevenueINR / totalMachineHoursPerYear) : 0;
      const downtimeSavingsINR = revenuePerMachineHour * downtimeHoursPerMachineYear * downtimeReductionPct * (Number(v.numMachines) || 0) / (Number(v.numMachines) || 1);
      // Note: formula follows the specification; number of machines cancels mathematically but included for clarity.

      // Quality savings: reduce rejections by 15% (midpoint)
      const qualityReductionPct = 0.15;
      const rejectionRate = (Number(v.rejectionRatePct) || 0) / 100;
      const rejectionCostINR = annualRevenueINR * rejectionRate; // conservative proxy: rejected value equals proportion of revenue
      const qualitySavingsINR = rejectionCostINR * qualityReductionPct;

      // Procurement savings: 12% midpoint
      const procurementSavingsINR = procurementINR * 0.12;

      const totalSavingsINR = (downtimeSavingsINR || 0) + (qualitySavingsINR || 0) + (procurementSavingsINR || 0);

      const implementationCostINR = ((Number(v.implementationCostCr) || 0) + (Number(v.firstYearSubscriptionCr) || 0)) * INR_PER_CRORE;
      const paybackMonths = (implementationCostINR > 0 && totalSavingsINR > 0) ? (implementationCostINR / (totalSavingsINR / 12)) : null;

      // Return breakdown, total (INR), and optional paybackMonths.
      return {
        breakdown: {
          downtime: downtimeSavingsINR,
          quality: qualitySavingsINR,
          procurement: procurementSavingsINR
        },
        totalSavingsINR: totalSavingsINR,
        paybackMonths: paybackMonths
      };
    }
  },
  'electric-vehicles': {
    fields: [
      { key: 'unitsPerYear', label: 'Annual production volume (units/year)', placeholder: '10000' },
      { key: 'avgSellingPrice', label: 'Average selling price per unit (₹)', placeholder: '1500000', unit: '₹' },
      { key: 'batteryCostPerUnit', label: 'Battery pack cost per unit (₹)', placeholder: '400000', unit: '₹' },
      { key: 'batteryScrapRatePct', label: 'Battery pack rejection/scrap rate (%)', placeholder: '2', unit: '%' },
      { key: 'monthlyDowntimeHrs', label: 'Monthly line downtime hours', placeholder: '10', unit: 'h' },
      { key: 'annualProcurementCr', label: 'Annual procurement spend (₹ Crore)', placeholder: '50', unit: 'Cr' },
      { key: 'numVolatileComponents', label: 'Number of critical volatile components', placeholder: '4' },
      { key: 'implementationCostCr', label: 'Estimated implementation cost (one-time, ₹ Crore, optional)', placeholder: '1', unit: 'Cr', help: 'Typical for EV lines: ₹0.5–2.0 Cr' },
      { key: 'firstYearSubscriptionCr', label: 'First-year subscription (₹ Crore, optional)', placeholder: '0.2', unit: 'Cr', help: 'Typical SaaS fees: ₹0.05–0.3 Cr/yr' },
      { key: 'energyCostPerKwh', label: 'Energy cost per kWh (optional)', placeholder: '8', unit: '₹' },
      { key: 'inventoryHoldingPct', label: 'Inventory holding cost % (optional)', placeholder: '15', unit: '%' },
      { key: 'parallelLines', label: 'Number of parallel lines (optional)', placeholder: '1' }
    ],
    compute: (v) => {
      const INR_PER_CRORE = 10000000;
      const units = Number(v.unitsPerYear) || 0;
      const avgPrice = Number(v.avgSellingPrice) || 0;
      const annualRevenueINR = units * avgPrice;

      const batteryCost = Number(v.batteryCostPerUnit) || 0;
      const scrapRate = (Number(v.batteryScrapRatePct) || 0) / 100;
      // Battery scrap reduction midpoint 12%
      const batteryReductionPct = 0.12;
      const batteryScrapSavingsINR = batteryCost * units * scrapRate * batteryReductionPct;

      // Downtime: midpoint 28% reduction
      const downtimeReductionPct = 0.28;
      const parallel = Math.max(1, Number(v.parallelLines) || 1);
      const HOURS_PER_LINE_YEAR = 24 * 365;
      const lineHoursPerYear = HOURS_PER_LINE_YEAR * parallel;
      const monthlyDowntime = Number(v.monthlyDowntimeHrs) || 0;
      const revenuePerLineHour = lineHoursPerYear > 0 ? (annualRevenueINR / lineHoursPerYear) : 0;
      const downtimeSavingsINR = revenuePerLineHour * monthlyDowntime * 12 * downtimeReductionPct;

      // Procurement savings: midpoint 10%
      const procurementINR = (Number(v.annualProcurementCr) || 0) * INR_PER_CRORE;
      const procurementSavingsINR = procurementINR * 0.10;

      // Throughput uplift: midpoint 5%
      const throughputSavingsINR = annualRevenueINR * 0.05;

      const totalSavingsINR = (batteryScrapSavingsINR || 0) + (downtimeSavingsINR || 0) + (procurementSavingsINR || 0) + (throughputSavingsINR || 0);

      const implementationCostINR = (Number(v.implementationCostCr) || 0) * INR_PER_CRORE;
      const paybackMonths = (implementationCostINR > 0 && totalSavingsINR > 0) ? (implementationCostINR / (totalSavingsINR / 12)) : null;

      return {
        breakdown: {
          battery: batteryScrapSavingsINR,
          downtime: downtimeSavingsINR,
          procurement: procurementSavingsINR,
          throughput: throughputSavingsINR
        },
        totalSavingsINR: totalSavingsINR,
        paybackMonths: paybackMonths
      };
    }
  },
  logistics: {
    fields: [
      { key: 'annualShipments', label: 'Annual shipments handled', placeholder: '50000' },
      { key: 'costPerShipment', label: 'Cost per shipment (₹)', placeholder: '300', unit: '₹' },
      { key: 'onTimeRatePct', label: 'On-time delivery rate (%)', placeholder: '92', unit: '%' },
      { key: 'avgDelayHrsPerShipment', label: 'Average delay hours per shipment', placeholder: '6', unit: 'h' },
      { key: 'annualFuelSpendCr', label: 'Annual fuel spend (₹ Crore)', placeholder: '2', unit: 'Cr' },
      { key: 'fleetSize', label: 'Fleet size', placeholder: '50' },
      { key: 'implementationCostCr', label: 'Estimated implementation cost (one-time, ₹ Crore, optional)', placeholder: '0.3', unit: 'Cr', help: 'Typical: ₹0.1–0.5 Cr' },
      { key: 'firstYearSubscriptionCr', label: 'First-year subscription (₹ Crore, optional)', placeholder: '0.05', unit: 'Cr', help: 'Typical: ₹0.01–0.1 Cr/yr' }
    ],
    compute: (v) => {
      const INR_PER_CRORE = 10000000;
      const shipments = Number(v.annualShipments) || 0;
      const costPer = Number(v.costPerShipment) || 0;
      const avgDelayHrs = Number(v.avgDelayHrsPerShipment) || 0;

      // Delay cost per shipment proxy = costPer * (avgDelayHrs / 24)
      const delayCostPerShipment = costPer * (avgDelayHrs / 24);
      const delaySavings = shipments * delayCostPerShipment * 0.20;

      const fuelSavings = (Number(v.annualFuelSpendCr) || 0) * INR_PER_CRORE * 0.10;

      const annualRevenue = shipments * costPer;
      const utilisationSavings = annualRevenue * 0.07;

      const totalSavingsINR = delaySavings + fuelSavings + utilisationSavings;

      const implementationCostINR = ((Number(v.implementationCostCr) || 0) + (Number(v.firstYearSubscriptionCr) || 0)) * INR_PER_CRORE;
      const paybackMonths = (implementationCostINR > 0 && totalSavingsINR > 0) ? (implementationCostINR / (totalSavingsINR / 12)) : null;

        return {
          breakdown: { delay: delaySavings, fuel: fuelSavings, utilisation: utilisationSavings },
          totalSavingsINR: totalSavingsINR,
          paybackMonths
        };
      }
    },
    'pharma-manufacturing': {
      fields: [
        { key: 'annualBatches', label: 'Annual production batches', placeholder: '1200' },
        { key: 'batchValue', label: 'Batch value (₹)', placeholder: '500000', unit: '₹' },
        { key: 'batchFailureRatePct', label: 'Batch failure rate (%)', placeholder: '4', unit: '%' },
        { key: 'qaQcCycleTimeHours', label: 'QA/QC cycle time (hours)', placeholder: '2', unit: 'h' },
        { key: 'qaCostPerHour', label: 'QA cost per hour (₹, optional)', placeholder: '2000', unit: '₹' },
        { key: 'annualProcurementCr', label: 'Annual procurement spend (₹ Crore)', placeholder: '10', unit: 'Cr' },
        { key: 'complianceDeviationCount', label: 'Compliance deviations / year', placeholder: '5' },
        { key: 'deviationCostPerEvent', label: 'Deviation cost per event (₹, optional)', placeholder: '200000', unit: '₹' },
        { key: 'implementationCostCr', label: 'Estimated implementation cost (one-time, ₹ Crore, optional)', placeholder: '0.6', unit: 'Cr' },
        { key: 'firstYearSubscriptionCr', label: 'First-year subscription (₹ Crore, optional)', placeholder: '0.08', unit: 'Cr' }
      ],
      compute: (v) => {
        const INR_PER_CRORE = 10000000;
        const batches = Number(v.annualBatches) || 0;
        const batchValue = Number(v.batchValue) || 0;
        const failureRate = (Number(v.batchFailureRatePct) || 0) / 100;

        const batchSavings = batches * batchValue * failureRate * 0.14;

        const qaHours = batches * (Number(v.qaQcCycleTimeHours) || 0);
        const qaCostPerHour = Number(v.qaCostPerHour) || 0;
        const qaSavings = qaCostPerHour * qaHours * 0.25;

        const procurementINR = (Number(v.annualProcurementCr) || 0) * INR_PER_CRORE;
        const procurementSavings = procurementINR * 0.10;

        const deviationCostPerEvent = Number(v.deviationCostPerEvent) || (batchValue * 0.1);
        const complianceSavings = (Number(v.complianceDeviationCount) || 0) * deviationCostPerEvent * 0.20;

        const totalSavingsINR = batchSavings + qaSavings + procurementSavings + complianceSavings;

        const implementationCostINR = ((Number(v.implementationCostCr) || 0) + (Number(v.firstYearSubscriptionCr) || 0)) * INR_PER_CRORE;
        const paybackMonths = (implementationCostINR > 0 && totalSavingsINR > 0) ? (implementationCostINR / (totalSavingsINR / 12)) : null;

        return { breakdown: { batch: batchSavings, qa: qaSavings, procurement: procurementSavings, compliance: complianceSavings }, totalSavingsINR, paybackMonths };
      }
    },
    'real-estate': {
    fields: [
      { key: 'numProperties', label: 'Number of properties', placeholder: '50' },
      { key: 'annualMaintenanceSpend', label: 'Annual maintenance spend (₹)', placeholder: '2000000', unit: '₹' },
      { key: 'vacancyRatePct', label: 'Vacancy rate (%)', placeholder: '8', unit: '%' },
      { key: 'avgRentPerUnit', label: 'Average rent per unit (₹)', placeholder: '15000', unit: '₹' },
      { key: 'energyCostPerBuilding', label: 'Energy cost per building (₹)', placeholder: '50000', unit: '₹' },
      { key: 'annualTenantChurnPct', label: 'Annual tenant churn (%)', placeholder: '12', unit: '%' },
      { key: 'implementationCostCr', label: 'Estimated implementation cost (one-time, ₹ Crore, optional)', placeholder: '0.4', unit: 'Cr' },
      { key: 'firstYearSubscriptionCr', label: 'First-year subscription (₹ Crore, optional)', placeholder: '0.06', unit: 'Cr' }
    ],
    compute: (v) => {
      const INR_PER_CRORE = 10000000;
      const props = Number(v.numProperties) || 0;
      const maintenance = Number(v.annualMaintenanceSpend) || 0;
      const vacancyRate = (Number(v.vacancyRatePct) || 0) / 100;
      const rent = Number(v.avgRentPerUnit) || 0;
      const energy = Number(v.energyCostPerBuilding) || 0;
      const churnPct = (Number(v.annualTenantChurnPct) || 0) / 100;

      const maintenanceSavings = maintenance * 0.20;
      const vacancySavings = rent * props * vacancyRate * 0.07;
      const energySavings = energy * props * 0.12;
      const churnCost = rent * props * churnPct * 12; // annual churn cost proxy
      const churnSavings = churnCost * 0.15;

      const totalSavingsINR = maintenanceSavings + vacancySavings + energySavings + churnSavings;
      const implementationCostINR = ((Number(v.implementationCostCr) || 0) + (Number(v.firstYearSubscriptionCr) || 0)) * INR_PER_CRORE;
      const paybackMonths = (implementationCostINR > 0 && totalSavingsINR > 0) ? (implementationCostINR / (totalSavingsINR / 12)) : null;

      return { breakdown: { maintenance: maintenanceSavings, vacancy: vacancySavings, energy: energySavings, churn: churnSavings }, totalSavingsINR, paybackMonths };
    }
  },
  retail: {
    fields: [
      { key: 'annualRevenue', label: 'Annual revenue (₹)', placeholder: '50000000', unit: '₹' },
      { key: 'inventoryHoldingCostPct', label: 'Inventory holding cost (%)', placeholder: '20', unit: '%' },
      { key: 'stockoutRatePct', label: 'Stockout rate (%)', placeholder: '5', unit: '%' },
      { key: 'shrinkagePct', label: 'Shrinkage (%)', placeholder: '2', unit: '%' },
      { key: 'marketingSpend', label: 'Annual marketing spend (₹)', placeholder: '2000000', unit: '₹' },
      { key: 'numSKUs', label: 'Number of SKUs', placeholder: '1200' },
      { key: 'implementationCostCr', label: 'Estimated implementation cost (one-time, ₹ Crore, optional)', placeholder: '0.25', unit: 'Cr' },
      { key: 'firstYearSubscriptionCr', label: 'First-year subscription (₹ Crore, optional)', placeholder: '0.05', unit: 'Cr' }
    ],
    compute: (v) => {
      const INR_PER_CRORE = 10000000;
      const revenue = Number(v.annualRevenue) || 0;
      const holdingPct = (Number(v.inventoryHoldingCostPct) || 0) / 100;
      const stockoutPct = (Number(v.stockoutRatePct) || 0) / 100;
      const shrinkagePct = (Number(v.shrinkagePct) || 0) / 100;
      const marketing = Number(v.marketingSpend) || 0;

      const inventorySavings = (revenue * holdingPct) * 0.15;
      const lostSales = revenue * stockoutPct;
      const stockoutSavings = lostSales * 0.25;
      const shrinkageSavings = (revenue * shrinkagePct) * 0.12;
      const marketingSavings = marketing * 0.10;

      const totalSavingsINR = inventorySavings + stockoutSavings + shrinkageSavings + marketingSavings;
      const implementationCostINR = ((Number(v.implementationCostCr) || 0) + (Number(v.firstYearSubscriptionCr) || 0)) * INR_PER_CRORE;
      const paybackMonths = (implementationCostINR > 0 && totalSavingsINR > 0) ? (implementationCostINR / (totalSavingsINR / 12)) : null;

      return { breakdown: { inventory: inventorySavings, stockout: stockoutSavings, shrinkage: shrinkageSavings, marketing: marketingSavings }, totalSavingsINR, paybackMonths };
    }
  },
  'energy-utilities': {
    fields: [
      { key: 'annualEnergyVolume', label: 'Annual energy generation / distribution (units)', placeholder: '1000000' },
      { key: 'outageHoursPerYear', label: 'Outage hours per year', placeholder: '200' },
      { key: 'maintenanceSpend', label: 'Annual maintenance spend (₹)', placeholder: '5000000', unit: '₹' },
      { key: 'energyLossRatePct', label: 'Energy loss rate (%)', placeholder: '6', unit: '%' },
      { key: 'procurementSpendCr', label: 'Fuel/energy procurement spend (₹ Crore)', placeholder: '30', unit: 'Cr' },
      { key: 'implementationCostCr', label: 'Estimated implementation cost (one-time, ₹ Crore, optional)', placeholder: '0.8', unit: 'Cr' },
      { key: 'firstYearSubscriptionCr', label: 'First-year subscription (₹ Crore, optional)', placeholder: '0.12', unit: 'Cr' }
    ],
    compute: (v) => {
      const INR_PER_CRORE = 10000000;
      const maintenance = Number(v.maintenanceSpend) || 0;
      const lossPct = (Number(v.energyLossRatePct) || 0) / 100;
      const procurement = (Number(v.procurementSpendCr) || 0) * INR_PER_CRORE;

      const outageSavings = (maintenance + procurement * 0.05) * 0.28; // proxy combining maintenance & procurement exposure
      const lossSavings = (procurement * lossPct) * 0.07;
      const maintenanceSavings = maintenance * 0.12;
      const procurementSavings = procurement * 0.08;

      const totalSavingsINR = outageSavings + lossSavings + maintenanceSavings + procurementSavings;
      const implementationCostINR = ((Number(v.implementationCostCr) || 0) + (Number(v.firstYearSubscriptionCr) || 0)) * INR_PER_CRORE;
      const paybackMonths = (implementationCostINR > 0 && totalSavingsINR > 0) ? (implementationCostINR / (totalSavingsINR / 12)) : null;

      return { breakdown: { outage: outageSavings, loss: lossSavings, maintenance: maintenanceSavings, procurement: procurementSavings }, totalSavingsINR, paybackMonths };
    }
  },
  hospitality: {
    fields: [
      { key: 'numRooms', label: 'Number of rooms', placeholder: '120' },
      { key: 'occupancyRatePct', label: 'Occupancy rate (%)', placeholder: '72', unit: '%' },
      { key: 'avgDailyRate', label: 'Average daily rate (ADR, ₹)', placeholder: '4500', unit: '₹' },
      { key: 'annualEnergySpend', label: 'Annual energy spend (₹)', placeholder: '2000000', unit: '₹' },
      { key: 'staffCost', label: 'Annual staff cost (₹)', placeholder: '12000000', unit: '₹' },
      { key: 'guestComplaintRatePct', label: 'Guest complaint rate (%)', placeholder: '4', unit: '%' },
      { key: 'implementationCostCr', label: 'Estimated implementation cost (one-time, ₹ Crore, optional)', placeholder: '0.35', unit: 'Cr' },
      { key: 'firstYearSubscriptionCr', label: 'First-year subscription (₹ Crore, optional)', placeholder: '0.06', unit: 'Cr' }
    ],
    compute: (v) => {
      const INR_PER_CRORE = 10000000;
      const rooms = Number(v.numRooms) || 0;
      const occ = (Number(v.occupancyRatePct) || 0) / 100;
      const adr = Number(v.avgDailyRate) || 0;
      const annualRevenue = rooms * occ * adr * 365;
      const energy = Number(v.annualEnergySpend) || 0;
      const staff = Number(v.staffCost) || 0;
      const complaintPct = (Number(v.guestComplaintRatePct) || 0) / 100;

      const occupancySavings = annualRevenue * 0.05;
      const energySavings = energy * 0.12;
      const staffSavings = staff * 0.10;
      const complaintCost = annualRevenue * complaintPct;
      const complaintSavings = complaintCost * 0.15;

      const totalSavingsINR = occupancySavings + energySavings + staffSavings + complaintSavings;
      const implementationCostINR = ((Number(v.implementationCostCr) || 0) + (Number(v.firstYearSubscriptionCr) || 0)) * INR_PER_CRORE;
      const paybackMonths = (implementationCostINR > 0 && totalSavingsINR > 0) ? (implementationCostINR / (totalSavingsINR / 12)) : null;

      return { breakdown: { occupancy: occupancySavings, energy: energySavings, staff: staffSavings, complaint: complaintSavings }, totalSavingsINR, paybackMonths };
    }
  },
  'innovation-rd': {
    fields: [
      { key: 'annualRdSpend', label: 'Annual R&D spend (₹)', placeholder: '20000000', unit: '₹' },
      { key: 'numProjects', label: 'Number of projects', placeholder: '12' },
      { key: 'avgProjectCycleMonths', label: 'Avg project cycle (months)', placeholder: '12', unit: 'mo' },
      { key: 'failureRatePct', label: 'Failure rate (%)', placeholder: '30', unit: '%' },
      { key: 'timeToMarketDelayCost', label: 'Time-to-market delay cost (₹)', placeholder: '5000000', unit: '₹' },
      { key: 'implementationCostCr', label: 'Estimated implementation cost (one-time, ₹ Crore, optional)', placeholder: '0.4', unit: 'Cr' },
      { key: 'firstYearSubscriptionCr', label: 'First-year subscription (₹ Crore, optional)', placeholder: '0.07', unit: 'Cr' }
    ],
    compute: (v) => {
      const INR_PER_CRORE = 10000000;
      const rd = Number(v.annualRdSpend) || 0;
      const failureCost = rd * ((Number(v.failureRatePct) || 0) / 100);
      const delayCost = Number(v.timeToMarketDelayCost) || 0;

      const cycleSavings = rd * 0.15;
      const failureSavings = failureCost * 0.10;
      const ttmSavings = delayCost * 0.07;

      const totalSavingsINR = cycleSavings + failureSavings + ttmSavings;
      const implementationCostINR = ((Number(v.implementationCostCr) || 0) + (Number(v.firstYearSubscriptionCr) || 0)) * INR_PER_CRORE;
      const paybackMonths = (implementationCostINR > 0 && totalSavingsINR > 0) ? (implementationCostINR / (totalSavingsINR / 12)) : null;

      return { breakdown: { cycle: cycleSavings, failure: failureSavings, ttm: ttmSavings }, totalSavingsINR, paybackMonths };
    }
  }
};

// Backwards-compatible aliases so industry ids used elsewhere map to these configs
ROI_CONFIG['pharma'] = ROI_CONFIG['pharma-manufacturing'];
ROI_CONFIG['energy'] = ROI_CONFIG['energy-utilities'];
ROI_CONFIG['innovation'] = ROI_CONFIG['innovation-rd'];

const number = (v) => (isNaN(Number(v)) ? 0 : Number(v));

function ROIForm({ industryId }) {
  const cfg = useMemo(() => ROI_CONFIG[industryId] || ROI_CONFIG['manufacturing'], [industryId]);
  const initial = useMemo(() => cfg.fields.reduce((acc, f) => ({ ...acc, [f.key]: number(f.placeholder) }), {}), [cfg]);
  const [values, setValues] = useState(initial);
  const [result, setResult] = useState(() => {
    try { return cfg.compute(initial); } catch (e) { return { totalSavingsINR: 0, breakdown: null, paybackMonths: null }; }
  });
  

  const onChange = (k, v) => setValues(prev => ({ ...prev, [k]: number(v) }));

  // when industry changes, reset form and result
  React.useEffect(() => {
    setValues(initial);
    try { setResult(cfg.compute(initial)); } catch (e) { setResult({ annualSavings: 0, paybackMonths: null }); }
  }, [cfg, initial]);

  const handleCalculate = () => {
    try {
      // ensure numeric values are passed to compute() to avoid type issues
      const numericValues = cfg.fields.reduce((acc, f) => ({ ...acc, [f.key]: number(values[f.key]) }), {});
      const r = cfg.compute(numericValues) || {};
      // debug log
      // eslint-disable-next-line no-console
      console.log('ROI calculate', { industryId: industryId, numericValues, result: r });
      // normalize result shape: prefer totalSavingsINR (new manufacturing shape), fall back to annualSavings
      let normalized = { totalSavingsINR: 0, breakdown: null, paybackMonths: null };
      if (r.totalSavingsINR !== undefined) {
        normalized.totalSavingsINR = Number(r.totalSavingsINR) || 0;
        normalized.breakdown = r.breakdown || null;
        normalized.paybackMonths = r.paybackMonths ? Number(r.paybackMonths) : null;
      } else if (r.annualSavings !== undefined) {
        normalized.totalSavingsINR = Number(r.annualSavings) || 0;
        normalized.breakdown = null;
        normalized.paybackMonths = r.paybackMonths ? Number(r.paybackMonths) : null;
      }
      setResult(normalized);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('ROI calculate error', e);
      setResult({ totalSavingsINR: 0, breakdown: null, paybackMonths: null });
    }
  };

  const safeTotalINR = isNaN(Number(result?.totalSavingsINR)) ? 0 : Number(result?.totalSavingsINR);
  // convert to Lakhs for display (1 Lakh = 100,000 INR)
  const lakhs = safeTotalINR / 100000;

  const BREAKDOWN_LABELS = {
    downtime: 'Downtime',
    quality: 'Quality (rejections)',
    procurement: 'Procurement',
    battery: 'Battery scrap',
    throughput: 'Throughput'
  };

  return (
    <div>
      <div className="space-y-3">
        {cfg.fields.map(f => (
          <div key={f.key} className="flex items-center gap-3">
            <label className="w-56 text-sm text-gray-700">{f.label}</label>
            <input
              type="number"
              value={values[f.key]}
              onChange={e => onChange(f.key, e.target.value)}
              placeholder={f.placeholder}
              className="flex-1 border p-2 rounded-lg"
            />
            {f.unit && (
              <div className="w-16 text-right text-sm text-gray-500">{f.unit}</div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-4 p-4 bg-white border rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-gray-600">Estimated annual savings</div>
            <div className="text-2xl font-bold text-[#212121]">₹ {lakhs.toFixed(2)} L/yr</div>
            <div className="text-sm text-gray-600 mt-2">{result.paybackMonths ? `Payback: ${Math.round(result.paybackMonths)} months` : 'Payback: N/A'}</div>
          </div>
          <div>
            <button onClick={handleCalculate} className="px-4 py-2 bg-[#5856D6] text-white rounded-lg">Calculate</button>
          </div>
        </div>

        {result.breakdown && (
          <div className="mt-4">
            <div className="text-sm font-semibold mb-2">Breakdown</div>
            <table className="w-full text-sm">
              <tbody>
                {Object.entries(result.breakdown).map(([k, v]) => {
                  const label = BREAKDOWN_LABELS[k] || k;
                  const val = isNaN(Number(v)) ? 0 : Number(v);
                  return (
                    <tr key={k} className="border-t">
                      <td className="py-2 text-gray-600">{label}</td>
                      <td className="py-2 text-right">₹ {(val / 100000).toFixed(2)} L</td>
                    </tr>
                  );
                })}
                <tr className="border-t font-bold"><td className="py-2">Total</td><td className="py-2 text-right">₹ {(result.totalSavingsINR/100000).toFixed(2)} L</td></tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ROIPage({ navigate, industries = [], initialIndustry }) {
  const defaultId = initialIndustry || industries[0]?.id || 'manufacturing';
  const [industryId, setIndustryId] = useState(defaultId);

  return (
    <div className="pt-24 pb-16 min-h-screen bg-white animate-fade-in-up">
      <div className="max-w-5xl mx-auto px-6">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">ROI Calculator</h1>
            <p className="text-gray-600 mt-2">Select an industry to load tailored parameters for the ROI estimate.</p>
          </div>
          <div className="flex space-x-3">
            <button onClick={() => navigate('home')} className="px-4 py-2 rounded-lg border">Back</button>
            <button onClick={() => navigate('contact')} className="px-4 py-2 rounded-lg bg-[#2EC5CE] text-white">Request Demo</button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 items-start">
          <div className="md:col-span-1 bg-white p-6 rounded-2xl shadow-sm">
            <label className="text-sm text-gray-600">Industry</label>
            <select value={industryId} onChange={e => setIndustryId(e.target.value)} className="w-full border p-2 rounded-lg mt-2">
              {industries.map(ind => <option key={ind.id} value={ind.id}>{ind.name}</option>)}
            </select>
            <div className="mt-4 text-sm text-gray-500">Choose an industry to pre-load typical assumptions. Adjust inputs to reflect your business.</div>
          </div>

          <div className="md:col-span-2 bg-white p-6 rounded-2xl shadow-sm">
            <ROIForm industryId={industryId} />
          </div>
        </div>
      </div>
    </div>
  );
}
