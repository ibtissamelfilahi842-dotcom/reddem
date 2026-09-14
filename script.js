/* ==========================================================================
   CODE VAULT - RECENT REDEEM & RESOURCE MODAL LOGIC
   ========================================================================== */

let currentSelectedGame = '';

function openRedeemModal(gameName, rewardAmount, iconClass, gameLogoUrl = '') {
  currentSelectedGame = gameName;

  const modal = document.getElementById('redeemModal');
  const modalBadge = document.getElementById('modalGameBadge');
  const resourceAmount = document.getElementById('modalResourceAmount');
  const resourceIcon = document.getElementById('modalResourceIcon');
  const resourceImg = document.getElementById('modalResourceImg');

  const codeDisplay = document.getElementById('modalCodeDisplay');
  const progressBar = document.getElementById('progressBarFill');
  const statusText = document.getElementById('generatorStatus');
  const actionBtn = document.getElementById('modalActionBtn');

  // Update Game and Resource details
  if (modalBadge) modalBadge.textContent = gameName;
  if (resourceAmount) resourceAmount.textContent = rewardAmount;
  if (resourceIcon && iconClass) resourceIcon.className = `fa-solid ${iconClass}`;
  
  // Set logo image url if provided, otherwise show fallback icon
  const placeholder = document.getElementById('modalResourcePlaceholder');
  if (resourceImg) {
    if (gameLogoUrl && gameLogoUrl.trim() !== '') {
      resourceImg.src = gameLogoUrl;
      resourceImg.style.display = 'block';
      if (placeholder) placeholder.style.display = 'none';
    } else {
      resourceImg.src = '';
      resourceImg.style.display = 'none';
      if (placeholder) placeholder.style.display = 'flex';
    }
  }

  // Reset generator state
  if (codeDisplay) codeDisplay.textContent = 'XXXX-XXXX-XXXX-XXXX';
  if (progressBar) progressBar.style.width = '0%';
  if (statusText) statusText.textContent = 'Click button to generate code...';

  // Hide verify button on reset
  const verifyBtn = document.getElementById('verifyBtn');
  if (verifyBtn) verifyBtn.style.display = 'none';
  
  if (actionBtn) {
    actionBtn.disabled = false;
    actionBtn.style.display = 'flex';
    actionBtn.innerHTML = `<i class="fa-solid fa-key"></i> Generate Code Now`;
    actionBtn.onclick = startGeneratorProcess;
  }

  if (modal) {
    modal.classList.add('active');
  }
}

function closeRedeemModal() {
  const modal = document.getElementById('redeemModal');
  if (modal) {
    modal.classList.remove('active');
  }
}

function startGeneratorProcess() {
  const actionBtn = document.getElementById('modalActionBtn');
  const progressBar = document.getElementById('progressBarFill');
  const statusText = document.getElementById('generatorStatus');
  const codeDisplay = document.getElementById('modalCodeDisplay');
  const verifyBtn = document.getElementById('verifyBtn');

  if (actionBtn) actionBtn.disabled = true;

  const steps = [
    { progress: 20, status: 'Connecting to server...' },
    { progress: 45, status: `Searching active ${currentSelectedGame} code...` },
    { progress: 75, status: 'Encrypting 16-digit reward code...' },
    { progress: 100, status: 'Code Generated! Verify to unlock last 4 digits.' }
  ];

  let currentStep = 0;
  let finalCode = '';

  const interval = setInterval(() => {
    if (currentStep < steps.length) {
      const step = steps[currentStep];
      if (progressBar) progressBar.style.width = step.progress + '%';
      if (statusText) statusText.textContent = step.status;

      if (step.progress < 100) {
        codeDisplay.textContent = generatePartialMaskedCode(currentSelectedGame);
      } else {
        finalCode = generateFinalCode(currentSelectedGame);
        // Show first 12 chars visible, last 4 hidden with ****
        const visible = finalCode.substring(0, finalCode.length - 4);
        codeDisplay.innerHTML = `${visible}<span style="color:#ccc;">****</span>`;
      }

      currentStep++;
    } else {
      clearInterval(interval);

      // Hide Generate button, show Verify button
      if (actionBtn) {
        actionBtn.style.display = 'none';
      }
      if (verifyBtn) {
        verifyBtn.style.display = 'flex';
      }
    }
  }, 650);
}

function generatePartialMaskedCode(gameName) {
  const prefixMap = {
    'HEROXHERO': 'HXH',
    'ROBLOX': 'RBLX',
    'FORTNITE': 'FORT',
    'PK XD': 'PKXD'
  };
  const prefix = prefixMap[gameName] || 'GAME';
  const r1 = Math.random().toString(36).substring(2, 6).toUpperCase();
  const r2 = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}-${r1}-${r2}-XXXX`;
}

function generateFinalCode(gameName) {
  const prefixMap = {
    'HEROXHERO': 'HXH',
    'ROBLOX': 'RBLX',
    'FORTNITE': 'FORT',
    'PK XD': 'PKXD'
  };
  const prefix = prefixMap[gameName] || 'GAME';
  const r1 = Math.random().toString(36).substring(2, 6).toUpperCase();
  const r2 = Math.random().toString(36).substring(2, 6).toUpperCase();
  const r3 = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}-${r1}-${r2}-${r3}`;
}
