function filterApps(apps) {
  const ignoredExact = [
    "Microsoft Update Health Tools",
    "VS JIT Debugger",
    "DiagnosticsHub_CollectionService",
    "Microsoft GameInput",
    "Microsoft Edge WebView2 Runtime",
    "Avast Update Helper",
    "RSA Engine",
    "UXP WebView Support",
    "IntelliTraceProfilerProxy",
    "ClickOnce Bootstrapper Package for Microsoft .NET Framework",
    "Node.js",
    "Microsoft System CLR Types for SQL Server",
    "Microsoft Visual Studio Setup WMI Provider",
    "Microsoft TestPlatform SDK Local Feed",
    "vcpp_crt.redist.clickonce",
    "VS Immersive Activate Helper",
    "RICOH Media Driver",
    "Microsoft Visual Studio Setup Configuration",
    "Synaptics Pointing Device Driver",
    "VLC media player",
    "LSI HDA Modem",
    "HP 3D DriveGuard",
    "Ovládací panel NVIDIA 342.01",
    "Ovl�dac� panel NVIDIA 342.01",
    "Git",
    "Microsoft Teams Meeting Add-in for Microsoft Office"
  ];

  const ignoredStartsWith = [
    "Microsoft Visual C++",
    "Microsoft .NET ",
    "Microsoft ASP.NET Core",
    "Microsoft Windows Desktop",
    "Microsoft.NET.",
    "vs_",
    "icecap_",
    "Microsoft Office",
    "7-Zip ",
    "Java ",
    "IntelliJ IDEA ",
    "Security Update for Microsoft",
    "NVIDIA ",
    "Update for ",
    "Entity Framework ",
    "Aktualizace produktu ",
    "Update for ",
    "Microsoft System CLR Types for SQL Server ",
    "Ovládací panel",
    "Kontrola stavu",
    "Sada Compatibility "
  ];

  return apps.filter(app => {
    if (ignoredExact.includes(app)) return false;
    if (ignoredStartsWith.some(prefix => app.startsWith(prefix))) return false;
    return true;
  });
}

async function testInstalledApps() {
  try {
    let apps = await window.electronAPI.getInstalledApps();
    apps = filterApps(apps);
    console.log(apps); 
  } catch (err) {
    console.error("Chyba při získávání aplikací:", err);
  }
}

testInstalledApps();

