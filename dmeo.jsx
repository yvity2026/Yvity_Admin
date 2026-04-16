<motion.aside
  animate={{ width: collapsed ? 80 : 256 }}
  transition={{ duration: 0.3, ease: "easeInOut" }}
  className="hidden md:flex flex-col h-screen sticky top-0 border-r bg-[#0A4A4A]"
>
  {/* 🔹 FIXED HEADER PART */}
  <div className="flex-shrink-0">
    <div className="h-[60px] bg-white flex justify-center items-center">
      <Image src="/images/Adivisor/Navbar/navlogo.png" height={100} width={100} alt="Navbar logo" />
    </div>

    {/* Profile */}
    <div className="px-4 pt-6 flex flex-col items-center">
      <div className={`${collapsed ? "w-10 h-10" : "w-14 h-14"} rounded-full bg-white`} />

      {collapsed ? (
        <p className="text-white text-xs mt-2">{initials}</p>
      ) : (
        <p className="text-white text-sm font-semibold mt-2">{name}</p>
      )}

      <button className="flex items-center gap-2 mt-2 px-2 py-1 rounded-lg bg-[rgba(245,158,11,0.2)]">
        <FaCrown />
        {!collapsed && <span className="text-xs">Gold</span>}
      </button>
    </div>

    <hr className="bg-[#107171] my-3" />

    {/* Collapse Button */}
    <CollapseButton sidebarWidth={sidebarWidth} />
  </div>

  {/* 🔹 SCROLLABLE MENU */}
  <div className="flex-1 overflow-y-auto px-2">
    {menuItems.map((section, i) => (
      <div key={i} className="mb-4">
        {!collapsed && (
          <h3 className="text-xs px-4 mb-2 text-[#53807E] uppercase">
            {section.title}
          </h3>
        )}

        {section.navitems.map((item, j) => {
          const isActive = pathname === item.link;

          return (
            <Link
              key={j}
              href={item.link || "#"}
              className={`flex items-center gap-3 px-4 py-2 rounded-lg
                ${isActive ? "bg-[#107171] text-white" : "text-[#8BBEBE]"}
              `}
            >
              <span className="text-lg">{item.icon}</span>
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </div>
    ))}
  </div>

  {/* 🔹 FIXED FOOTER */}
  <div className="flex-shrink-0 border-t px-4 py-3">
    <Link href="/login" className="flex items-center gap-2 text-[#8BBEBE]">
      <MdOutlineLogout />
      {!collapsed && <span>Logout</span>}
    </Link>
  </div>
</motion.aside>