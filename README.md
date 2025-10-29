# DeFiScan V2 Modeller

A comprehensive web application for assessing and managing decentralized finance (DeFi) protocol risk ratings based on governance structures, function impact, and security controls.

## Features

### 🎯 Risk Rating System
- **Final Risk Rating**: Visual scale (AAA to D) representing overall protocol risk
- **Dynamic Calculation**: Real-time updates based on function classifications and severity scores
- **Multi-Project Support**: Assess multiple protocols simultaneously

### 📊 Configuration Management

#### Rating Scale Configuration
- Customize how severity and impact combinations map to final ratings (AAA-D)
- Editable rules for fine-tuning risk assessment criteria
- Collapsible interface to save screen space

#### Severity Ratings Matrix
- 2D matrix mapping Impact (Low, Medium, High, Critical) × Likelihood (Mitigated, Low, Medium, High) → Severity
- Interactive table for customizing severity thresholds
- Affects all function classifications dynamically
- Collapsible interface

#### Governance Likelihood Mapping
- **Voting Governance**: Configure parameter-based thresholds
  - Voting delay days (minimum days to execute)
  - Required voters (minimum consensus threshold)
  - Create multiple likelihood levels based on governance strength

- **Non-Voting Governance Types**: Direct likelihood assignment
  - EOA (Externally Owned Account)
  - Multisig (without delay)
  - Multisig with Delay ≥ 7 days
  - Security Council

- All changes propagate instantly to project severity scores
- Collapsible interface

### 🔧 Function Classification
- Define critical smart contract functions and their governance
- Select governance type for each function:
  - **Voting**: Trustless governance with configurable voting parameters
  - **Multisig with Delay ≥ 7d**: Multi-signature with mandatory delay
  - **Security Council**: Specialized governance body
  - **EOA**: Externally owned account (centralized control)
  - **Multisig**: Multi-signature without delay

- Auto-calculated likelihood score based on governance configuration
- Automatic severity calculation based on impact + governance likelihood
- Drag-and-drop rows for easy project management

### 📈 Project Management
- Create multiple projects/protocols
- Define custom project names
- Track function classifications per project
- View per-project risk ratings
- Automatic project rating calculation based on worst-case severity

### 🎨 Visualization Features
- **Risk Scale Bar**: Visual representation of overall risk position
- **Protocol Stages**: Classify protocols as Stage 0, 1, or 2 with visual indicators
- **Project Stacking**: Multiple projects visualized on risk scale
- **Dark/Light Mode**: Toggle theme preference
- **Color-Coded Severity**: Visual indicators for severity levels

## How It Works

### Calculation Chain
```
Governance Config → Likelihood → Severity → Final Rating
                   ↓
            Likelihood Mapping Rules
                   ↓
            Based on voting parameters
            or direct governance type
```

1. **User selects governance type** for a function
2. **Likelihood is calculated** based on:
   - For voting: voting delay + required voters vs. mapping rules
   - For others: pre-configured likelihood for that governance type
3. **Severity is looked up** in the matrix using Impact × Likelihood
4. **Final rating is determined** by the worst-case severity + impact combo

### Data Persistence
- All configurations are saved to browser localStorage
- Changes persist across browser sessions
- Automatic backup on every modification

## Usage Guide

### Step 1: Configure Governance Likelihood Mapping
1. Expand "Governance Likelihood Mapping" section
2. For **Voting Governance**:
   - Adjust voting delay thresholds for each likelihood level
   - Adjust required voter thresholds
3. For **Other Governance Types**: Select the default likelihood level

### Step 2: Set Up Severity Matrix
1. Expand "Severity Ratings Matrix"
2. Review or customize the Impact × Likelihood matrix
3. Adjust severity mappings as needed

### Step 3: Configure Rating Rules
1. Expand "Rating Scale Configuration"
2. Edit how severity/impact combinations map to final ratings (AAA-D)
3. Customize rating thresholds

### Step 4: Create Projects
1. Click "Add Project" to create a new protocol assessment
2. Enter the project name
3. Click "Add Row" to define functions

### Step 5: Classify Functions
1. **Function Name**: Enter the smart contract function path (e.g., "Proxy(PoolConfigurator).update")
2. **Impact**: Select from Low, Medium, High, Critical
3. **Governance Type**: Select the governance controlling this function
4. **Likelihood**: Auto-calculated based on governance configuration
5. **Severity Score**: Auto-calculated based on impact + likelihood

### Step 6: Review Risk Ratings
- Project rating displays at the top right of each project table
- Overall protocol rating shows on the risk scale visualization
- All ratings update in real-time as you make changes

## Technical Stack

- **Framework**: Next.js 16 (React 19)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v3
- **Build Tool**: Turbopack
- **UI Components**: shadcn/ui
- **State Management**: React Hooks
- **Storage**: Browser localStorage

## Key Components

- `FunctionClassificationTable`: Main table for editing function governance
- `SeverityRatingsTable`: 2D severity matrix editor
- `EditableRatingRules`: Rating scale configuration interface
- `LikelihoodMappingConfiguration`: Governance likelihood mapper
- `FinalRatingsVisualization`: Risk scale visualization
- `LikelihoodMappingConfiguration`: Collapsible governance config

## Getting Started

### Installation
```bash
npm install
```

### Development
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build
```bash
npm run build
npm run start
```

## Browser Support

- Chrome/Chromium (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

**Note**: Requires modern browser with ES2020+ support

## Notes

- All data is stored in browser localStorage and is not persisted to a server
- Clearing browser cache/storage will reset all data
- The application works offline once loaded
- Best viewed on desktop for full functionality (mobile responsive design planned)

## Future Enhancements

- [ ] Backend data persistence
- [ ] User authentication and collaboration
- [ ] API export (JSON/CSV)
- [ ] Governance parameter templates
- [ ] Historical version tracking
- [ ] Comment/annotation system
- [ ] Mobile-responsive improvements
- [ ] Dark mode theme customization

## License

Proprietary - DeFi Collective

## Support

For issues or feature requests, please contact the DeFi Collective team.
