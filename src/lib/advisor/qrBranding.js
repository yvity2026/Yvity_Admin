const qrCenterBadgeSvg = `
  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48">
    <circle cx="24" cy="24" r="20" fill="#000000" />
    <text
      x="24"
      y="31"
      text-anchor="middle"
      font-family="Arial, sans-serif"
      font-size="24"
      font-weight="700"
      fill="#FFFFFF"
    >
      Y
    </text>
  </svg>
`;

export const advisorQrCodeImageSettings = {
  src: `data:image/svg+xml;utf8,${encodeURIComponent(qrCenterBadgeSvg)}`,
  height: 36,
  width: 36,
  excavate: true,
};

export const advisorQrCodeLevel = "H";
