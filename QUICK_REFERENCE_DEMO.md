# SCEAP Demo Template - Quick Reference Card

## 📊 Template Overview

```
43 ITEMS | 4 PANELS | 3-4 LEVELS DEEP | ~813 kW TOTAL LOAD
```

---

## 🎯 Panel Summary

| Panel | Items | Load | Feeder | Key Equipment |
|-------|-------|------|--------|----------------|
| **MAIN-DIST** | 11 | 391 kW | - | Fire pump, Water pump, Elevator, Parking exhaust |
| **UPS** | 10 | 212 kW | 85 kW ACB-250A | Charger, Inverter, Bypass, Isolation Xfmr |
| **HVAC** | 11 | 140 kW | 120 kW ACB-200A | Chiller (55kW), AHU, Cooling tower, Pumps |
| **LIGHTING** | 11 | 70 kW | 65 kW ACB-100A | Floor lights, Outdoor, Emergency, Sensors |
| **TRANSFORMER** | 1 | - | - | TRF-MAIN (primary source) |

---

## 🔌 From Bus → To Bus (The Golden Rule)

```
From Bus = WHERE THE LOAD IS (endpoint)
To Bus   = WHERE POWER COMES FROM (source)

Example:
  Cable Row: From Bus = HVAC-CHILLER-MOTOR
             To Bus = HVAC-PANEL
  
  Means: Chiller is powered BY the HVAC-PANEL
         Power flows: HVAC-PANEL → HVAC-CHILLER-MOTOR
```

---

## 📍 Complete Path Examples

### 1️⃣ Direct from Main Panel (1-hop)
```
FIRE-PUMP-MOTOR
  ↓ (From=FIRE-PUMP-MOTOR, To=MAIN-DISTRIBUTION)
MAIN-DISTRIBUTION
  ↓ (From=MAIN-DISTRIBUTION, To=TRF-MAIN)
TRF-MAIN ✓

Path: TRF → MAIN-DIST → FIRE-PUMP (37kW, 33m)
```

### 2️⃣ Through Sub-Panel (2-hop)
```
HVAC-CHILLER-MOTOR
  ↓ (From=HVAC-CHILLER-MOTOR, To=HVAC-PANEL)
HVAC-PANEL
  ↓ (From=HVAC-PANEL, To=MAIN-DISTRIBUTION)
MAIN-DISTRIBUTION
  ↓ (From=MAIN-DISTRIBUTION, To=TRF-MAIN)
TRF-MAIN ✓

Path: TRF → MAIN-DIST → HVAC → CHILLER (55kW, 111m, ACB-160A)
```

### 3️⃣ Deep Nesting (3-hop)
```
UPS-CHARGER-1
  ↓ (From=UPS-CHARGER-1, To=UPS-PANEL)
UPS-PANEL
  ↓ (From=UPS-PANEL, To=MAIN-DISTRIBUTION)
MAIN-DISTRIBUTION
  ↓ (From=MAIN-DISTRIBUTION, To=TRF-MAIN)
TRF-MAIN ✓

Path: TRF → MAIN-DIST → UPS → CHARGER (18kW, 65m)
```

---

## 📋 All 43 Items at a Glance

### MAIN-DISTRIBUTION (Rows 1-11)
| # | Equipment | Load | Breaker |
|---|-----------|------|---------|
| 1 | Panel Header | 0 | ISOLATOR |
| 2 | → UPS-PANEL | 85 | ACB-250A |
| 3 | → HVAC-PANEL | 120 | ACB-200A |
| 4 | → LIGHTING-PANEL | 65 | ACB-100A |
| 5 | Fire Pump | 37 | MCCB-100A |
| 6 | Water Pump | 22 | MCCB-63A |
| 7 | Sewage Motor | 15 | MCCB-50A |
| 8 | Elevator | 11 | MCCB-32A |
| 9 | Gen Charger | 5 | MCB-20A |
| 10 | BMS | 3 | MCB-16A |
| 11 | Parking Exhaust | 7.5 | MCCB-25A |

### UPS-PANEL (Rows 12-21)
| # | Equipment | Load | Breaker |
|---|-----------|------|---------|
| 12 | Panel Header | 0 | MCCB |
| 13 | Battery Charger | 18 | MCCB-63A |
| 14 | Inverter | 40 | MCCB-100A |
| 15 | Static Bypass | 50 | MCCB-125A |
| 16 | Maint Bypass | 50 | MCCB-125A |
| 17 | Comm Module | 2 | MCB-10A |
| 18 | Battery Protect | 1 | MCB-6A |
| 19 | Alarm System | 3 | MCB-16A |
| 20 | Isolation Xfmr | 45 | MCCB-125A |
| 21 | Emergency Light | 4 | MCB-20A |

### HVAC-PANEL (Rows 22-32)
| # | Equipment | Load | Breaker |
|---|-----------|------|---------|
| 22 | Panel Header | 0 | MCCB |
| 23 | AHU-1 Motor | 22 | MCCB-80A |
| 24 | Chiller ⭐ | 55 | **ACB-160A** |
| 25 | Cooling Tower | 18.5 | MCCB-63A |
| 26 | Boiler Pump | 7.5 | MCCB-25A |
| 27 | Condenser Pump | 5.5 | MCCB-20A |
| 28 | Control Unit | 4 | MCB-16A |
| 29 | Zone Valves | 3 | MCB-13A |
| 30 | Damper Actuators | 2.2 | MCB-10A |
| 31 | Condenser Fan | 11 | MCCB-40A |
| 32 | Vibration Monitor | 1.5 | MCB-8A |

### LIGHTING-PANEL (Rows 33-43)
| # | Equipment | Load | Breaker |
|---|-----------|------|---------|
| 33 | Panel Header | 0 | MCCB |
| 34 | Floor 1 Lights | 12 | MCCB-40A |
| 35 | Floor 2 Lights | 12 | MCCB-40A |
| 36 | Floor 3 Lights | 12 | MCCB-40A |
| 37 | Parking Lights | 8 | MCCB-32A |
| 38 | Facade Lights | 5 | MCB-20A |
| 39 | Common Area | 6 | MCB-24A |
| 40 | Stairwell | 3 | MCB-13A |
| 41 | Loading Dock | 4 | MCB-16A |
| 42 | High Bay Lights | 7 | MCCB-25A |
| 43 | Sensors Control | 2.5 | MCB-10A |

---

## ✅ Validation Checklist

### For Path Discovery to Work:
- [ ] Equipment has From Bus name
- [ ] Equipment row has To Bus = panel name
- [ ] Panel has self-referencing row (From = To)
- [ ] Panel's To Bus = parent panel name
- [ ] Main panel's To Bus = "TRF-MAIN"
- [ ] No circular references
- [ ] All bus names consistent (case-sensitive!)

### For Voltage Drop Compliance:
- [ ] Voltage drop ≤ 5% (IEC 60364)
- [ ] Cable type specified (XLPE, PVC, EPR)
- [ ] Cable length > 0
- [ ] Power factor 0.8-0.95
- [ ] Efficiency 85-98%
- [ ] Load KW matches equipment rating

---

## 📐 Voltage Drop Calculation (Quick)

```
I = (P × 1000) / (√3 × V × PF × Eff)
  = Current in Amps

V-drop = (√3 × I × R × L) / 1000
       = Voltage drop in Volts

V-drop % = (V-drop / Voltage) × 100

Status:
  ≤ 3%  = Green ✓ Excellent
  3-5%  = Yellow ⚠ Acceptable  
  > 5%  = Red ✗ Exceeds limit
```

**Example: HVAC Chiller (55kW)**
```
I = (55 × 1000) / (1.732 × 415 × 0.80 × 0.88) ≈ 109A
V-drop ≈ 0.26V on 48m cable
V-drop % ≈ 0.06% ✓ VERY GOOD
```

---

## 🚀 How to Use

### Download Demo Template
1. Go to **Cable Sizing** tab
2. Click **"Download Demo Template"**
3. Open `SCEAP_Demo_Template.xlsx` in Excel
4. Use as reference for custom template

### Create Custom Template
1. Copy demo template
2. Replace equipment names with yours
3. Maintain From Bus → To Bus hierarchy
4. Keep panel headers (self-referencing)
5. Save as Excel file
6. Upload to SCEAP

### View Results
1. Go to **Optimization** tab
2. All paths discovered automatically
3. Each path shows:
   - Equipment name
   - Complete path to transformer
   - Total distance
   - Load and voltage drop
   - Validation status ✓✗
4. Select appropriate cable size

---

## 🔍 Key Equipment Specifications

### Critical Items (ACB Breakers with Short-Circuit Ratings)

| Equipment | Load | Breaker | Fault Current | Trip Time |
|-----------|------|---------|---------------|-----------|
| HVAC Chiller | 55 kW | ACB-160A | 22 kA | 150 ms |
| UPS Feeder | 85 kW | ACB-250A | 30 kA | 100 ms |
| HVAC Feeder | 120 kW | ACB-200A | 28 kA | 100 ms |
| Main Incomer | - | ISOLATOR | 50 kA | 100 ms |

### Standard Motor Starters (MCCB)

| Equipment | Load | Breaker | Installation |
|-----------|------|---------|--------------|
| Fire Pump | 37 kW | MCCB-100A | Conduit |
| Water Pump | 22 kW | MCCB-63A | Conduit |
| Sewage Motor | 15 kW | MCCB-50A | Conduit |
| Elevator | 11 kW | MCCB-32A | Conduit |

### Lighting Circuits (MCB/MCCB)

| Equipment | Load | Breaker | Installation |
|-----------|------|---------|--------------|
| Floor Lights (each) | 12 kW | MCCB-40A | Cable Tray |
| Outdoor Parking | 8 kW | MCCB-32A | Cable Tray |
| Emergency | 3-4 kW | MCB-13/16A | Cable Tray |

---

## 📁 Files & References

| File | Purpose |
|------|---------|
| demoData.ts | 43-item generator (TypeScript) |
| pathDiscoveryService.ts | Path discovery algorithm |
| SizingTab.tsx | Cable sizing UI component |
| DEMO_TEMPLATE_REDESIGN.md | Detailed specifications |
| DEMO_TEMPLATE_SUMMARY.md | Executive summary |

---

## 💡 Pro Tips

1. **Column Width:** Set to 15-20 chars for better readability
2. **Freeze Header:** Freeze row 1 when scrolling
3. **Consistent Naming:** Use hyphens (FIRE-PUMP) not spaces
4. **Voltage Consistent:** All rows typically 415V (3-phase)
5. **Power Factor:** Most motors 0.80-0.85, lights 0.95
6. **Derating:** Typically 0.87-0.92 depending on cable bundling

---

## ❓ Troubleshooting

**Problem:** Paths not discovered
- ✓ Check From/To Bus exist in corresponding rows
- ✓ Verify transformer name contains "TRF"
- ✓ Check for circular references

**Problem:** High voltage drop
- ✓ Use larger cable size
- ✓ Reduce cable length if possible
- ✓ Use lower resistance cable type (Cu > Al)

**Problem:** Template download fails
- ✓ Clear browser cache
- ✓ Try different browser
- ✓ Check file permissions

---

## 📞 Support Resources

- **Full Guide:** DEMO_TEMPLATE_REDESIGN.md (410 lines)
- **Summary:** DEMO_TEMPLATE_SUMMARY.md (500+ lines)
- **Source Code:** sceap-frontend/src/utils/demoData.ts
- **Git Log:** Commits with "demo template" in message

---

**Quick Reference Card v1.0** | Last Updated: Jan 2024 | Status: ✓ Complete
