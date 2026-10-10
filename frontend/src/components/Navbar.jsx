import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronDown } from "lucide-react";
import Magnetic from "./Magnetic";

const COURSE_LINKS = [
  { label: "Buniyaad", href: "/buniyaad" },
  { label: "Global Market", href: "/global-market" },
];

const ABOUT_LINKS = [
  { label: "The Story", href: "/about" },
  { label: "Media Coverage", href: "/media-coverage" },
  { label: "Blog", href: "/blog" },
];

const LINKS = [
  { label: "Why Us", href: "/#why" },
  { label: "Mentors", href: "/#mentor" },
  { label: "Vision", href: "/#vision" },
  {
    label: "Courses",
    href: "/#courses",
    dropdown: COURSE_LINKS,
  },
  {
    label: "ABOUT US",
    href: "/about",
    dropdown: ABOUT_LINKS,
  },
  { label: "Contact Us", href: "/#contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  // null | "courses" | "about"
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [mobileDropdown, setMobileDropdown] = useState(null);


  const toggleDropdown = (dropdown) => {
    setActiveDropdown((current) =>
      current === dropdown ? null : dropdown
    );
  };

  return (
    <>
      <header
        data-testid="site-navbar"
        className="sticky top-0 z-50 bg-[#050505]/85 backdrop-blur-md text-paper border-b border-white/10"
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-10 h-16 flex items-center justify-between">

          {/* Logo */}
          <Link
            to="/"
            data-testid="nav-logo"
            className="flex items-center"
          >
            <img
              src="/logo-brand.png"
              alt="One Stock Academy"
              className="h-10 w-auto"
            />
          </Link>

          {/* DESKTOP NAV */}
          <nav className="hidden md:flex items-center gap-8 font-mono text-[11px] uppercase tracking-[0.18em] text-paper/60">

            {/* Why Us */}
            <a
              href="/#why"
              data-testid="nav-link-why"
              className="hover:text-paper transition-colors"
            >
              Why Us
            </a>

            {/* Mentors */}
            <a
              href="/#mentor"
              data-testid="nav-link-mentor"
              className="hover:text-paper transition-colors"
            >
              Mentors
            </a>

            {/* Vision */}
            <a
              href="/#vision"
              data-testid="nav-link-vision"
              className="hover:text-paper transition-colors"
            >
              Vision
            </a>

            {/* ================= COURSES ================= */}
            <div
              className="relative"
              onMouseEnter={() => setActiveDropdown("courses")}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button
                type="button"
                data-testid="nav-link-courses"
                onClick={() => toggleDropdown("courses")}
                className={`
                  flex items-center gap-1
                  uppercase
                  transition-all duration-300
                  ${activeDropdown === "courses"
                    ? "text-paper"
                    : "text-paper/60 hover:text-paper"
                  }
                `}
              >
                <span>Courses</span>

                <ChevronDown
                  className={`
                    w-3 h-3
                    transition-transform duration-300
                    ${activeDropdown === "courses"
                      ? "rotate-180"
                      : "rotate-0"
                    }
                  `}
                />
              </button>

              <AnimatePresence>
                {activeDropdown === "courses" && (
                  <motion.div
                    initial={{
                      opacity: 0,
                      y: 6,
                      scale: 0.98,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                      scale: 1,
                    }}
                    exit={{
                      opacity: 0,
                      y: 6,
                      scale: 0.98,
                    }}
                    transition={{
                      duration: 0.2,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className="
                      absolute
                      top-full
                      left-1/2
                      -translate-x-1/2
                      pt-4
                      w-52
                      z-50
                    "
                  >
                    <div
                      className="
                        relative
                        overflow-hidden
                        rounded-xl
                        bg-[#0b0b0b]/95
                        backdrop-blur-xl
                        border
                        border-white/15
                        shadow-[0_20px_60px_rgba(0,0,0,0.45)]
                      "
                    >
                      <div className="absolute top-0 left-0 right-0 h-px bg-white/20" />

                      <div className="px-5 pt-4 pb-3">
                        <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-paper/30">
                          Explore
                        </span>
                      </div>

                      <div className="pb-2">
                        {COURSE_LINKS.map((course, index) => (
                          <Link
                            key={course.href}
                            to={course.href}
                            onClick={() => setActiveDropdown(null)}
                            className="
                              group
                              relative
                              flex
                              items-center
                              justify-between
                              mx-2
                              px-3
                              py-3.5
                              rounded-lg
                              text-[11px]
                              uppercase
                              tracking-[0.12em]
                              text-paper/60
                              hover:text-white
                              hover:bg-white/[0.07]
                              transition-all
                              duration-300
                            "
                          >
                            <span className="flex items-center gap-3">
                              <span
                                className="
                                  font-mono
                                  text-[9px]
                                  text-brand/40
                                  group-hover:text-brand
                                  transition-colors
                                "
                              >
                                0{index + 1}
                              </span>

                              <span>{course.label}</span>
                            </span>

                            <span
                              className="
                                text-paper/20
                                group-hover:text-paper/80
                                group-hover:translate-x-1
                                transition-all
                                duration-300
                              "
                            >
                              →
                            </span>

                            <span
                              className="
                                absolute
                                bottom-0
                                left-3
                                right-3
                                h-px
                                bg-white/10
                                scale-x-0
                                group-hover:scale-x-100
                                origin-left
                                transition-transform
                                duration-300
                              "
                            />
                          </Link>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* ================= ABOUT US ================= */}
            <div
              className="relative"
              onMouseEnter={() => setActiveDropdown("about")}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button
                type="button"
                data-testid="nav-link-about"
                onClick={() => toggleDropdown("about")}
                className={`
                  flex items-center gap-1
                  uppercase
                  transition-all duration-300
                  ${activeDropdown === "about"
                    ? "text-paper"
                    : "text-paper/60 hover:text-paper"
                  }
                `}
              >
                <span>ABOUT US</span>

                <ChevronDown
                  className={`
                    w-3 h-3
                    transition-transform duration-300
                    ${activeDropdown === "about"
                      ? "rotate-180"
                      : "rotate-0"
                    }
                  `}
                />
              </button>

              <AnimatePresence>
                {activeDropdown === "about" && (
                  <motion.div
                    initial={{
                      opacity: 0,
                      y: 6,
                      scale: 0.98,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                      scale: 1,
                    }}
                    exit={{
                      opacity: 0,
                      y: 6,
                      scale: 0.98,
                    }}
                    transition={{
                      duration: 0.2,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className="
                      absolute
                      top-full
                      left-1/2
                      -translate-x-1/2
                      pt-4
                      w-52
                      z-50
                    "
                  >
                    <div
                      className="
                        relative
                        overflow-hidden
                        rounded-xl
                        bg-[#0b0b0b]/95
                        backdrop-blur-xl
                        border
                        border-white/15
                        shadow-[0_20px_60px_rgba(0,0,0,0.45)]
                      "
                    >
                      <div className="absolute top-0 left-0 right-0 h-px bg-white/20" />

                      <div className="px-5 pt-4 pb-3">
                        <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-paper/30">
                          Explore
                        </span>
                      </div>

                      <div className="pb-2">
                        {ABOUT_LINKS.map((about, index) => (
                          <Link
                            key={about.href}
                            to={about.href}
                            onClick={() => setActiveDropdown(null)}
                            className="
                              group
                              relative
                              flex
                              items-center
                              justify-between
                              mx-2
                              px-3
                              py-3.5
                              rounded-lg
                              text-[11px]
                              uppercase
                              tracking-[0.12em]
                              text-paper/60
                              hover:text-white
                              hover:bg-white/[0.07]
                              transition-all
                              duration-300
                            "
                          >
                            <span className="flex items-center gap-3">
                              <span
                                className="
                                  font-mono
                                  text-[9px]
                                  text-brand/40
                                  group-hover:text-brand
                                  transition-colors
                                "
                              >
                                0{index + 1}
                              </span>

                              <span>{about.label}</span>
                            </span>

                            <span
                              className="
                                text-paper/20
                                group-hover:text-paper/80
                                group-hover:translate-x-1
                                transition-all
                                duration-300
                              "
                            >
                              →
                            </span>

                            <span
                              className="
                                absolute
                                bottom-0
                                left-3
                                right-3
                                h-px
                                bg-white/10
                                scale-x-0
                                group-hover:scale-x-100
                                origin-left
                                transition-transform
                                duration-300
                              "
                            />
                          </Link>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Contact */}
            <a
              href="/#contact"
              data-testid="nav-link-contact"
              className="hover:text-paper transition-colors"
            >
              Contact Us
            </a>
          </nav>

          {/* Right Side */}
          <div className="flex items-center gap-3">
            <Magnetic strength={0.3}>
              <a
                href="https://course.onestockacademy.com"
                data-testid="nav-enroll-btn"
                className="
                  block
                  whitespace-nowrap
                  bg-paper
                  text-ink
                  font-mono
                  text-[11px]
                  uppercase
                  tracking-[0.18em]
                  px-5
                  py-2.5
                  hover:bg-white
                  transition-colors
                  rounded-full
                "
              >
                Enroll Now
              </a>
            </Magnetic>

            <button
              data-testid="mobile-menu-btn"
              onClick={() => setOpen(true)}
              aria-label="Open menu"
              className="
                md:hidden
                w-10
                h-10
                border
                border-white/20
                flex
                items-center
                justify-center
                text-white
              "
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {open && (
          <motion.div
            data-testid="mobile-menu"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{
              duration: 0.4,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="
              fixed
              inset-0
              z-[60]
              bg-[#050505]
              md:hidden
              flex
              flex-col
            "
          >
            <div className="h-16 px-6 flex items-center justify-between border-b border-white/10">
              <img
                src="/logo-brand.png"
                alt="One Stock Academy"
                className="h-10 w-auto"
              />

              <button
                data-testid="mobile-menu-close-btn"
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                className="
                  w-10
                  h-10
                  border
                  border-white/20
                  flex
                  items-center
                  justify-center
                  text-white
                "
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            {/* MOBILE NAVIGATION */}
            <nav className="flex-1 flex flex-col justify-center px-8 gap-2 overflow-y-auto">
              {LINKS.map((l, i) => {
                const hasDropdown = Boolean(l.dropdown);

                const dropdownKey =
                  l.label === "Courses"
                    ? "courses"
                    : l.label === "ABOUT US"
                      ? "about"
                      : null;

                const isDropdownOpen = mobileDropdown === dropdownKey;

                return (
                  <motion.div
                    key={l.href}
                    initial={{ opacity: 0, x: 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      delay: 0.15 + i * 0.06,
                      duration: 0.45,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                  >
                    {/* Main Link */}
                    {hasDropdown ? (
                      <button
                        type="button"
                        onClick={() =>
                          setMobileDropdown((current) =>
                            current === dropdownKey ? null : dropdownKey
                          )
                        }
                        className="
              w-full
              font-display
              text-4xl
              font-bold
              text-white
              py-3
              border-b
              border-white/5
              hover:text-zinc-400
              transition-colors
              flex
              items-center
              justify-between
              text-left
            "
                      >
                        <span className="flex items-baseline gap-4">
                          <span className="font-mono text-xs text-brand/70">
                            0{i + 1}
                          </span>

                          {l.label}
                        </span>

                        <ChevronDown
                          className={`
                w-6 h-6
                text-white/50
                transition-transform
                duration-300
                ${isDropdownOpen ? "rotate-180 text-white" : ""}
              `}
                        />
                      </button>
                    ) : (
                      <Link
                        to={l.href}
                        data-testid={`mobile-link-${l.label
                          .toLowerCase()
                          .replace(/\s+/g, "-")}`}
                        onClick={() => {
                          setOpen(false);
                          setMobileDropdown(null);
                        }}
                        className="
              font-display
              text-4xl
              font-bold
              text-white
              py-3
              border-b
              border-white/5
              hover:text-zinc-400
              transition-colors
              flex
              items-baseline
              gap-4
            "
                      >
                        <span className="font-mono text-xs text-brand/70">
                          0{i + 1}
                        </span>

                        {l.label}
                      </Link>
                    )}

                    {/* Mobile Dropdown */}
                    <AnimatePresence initial={false}>
                      {hasDropdown && isDropdownOpen && (
                        <motion.div
                          initial={{
                            height: 0,
                            opacity: 0,
                          }}
                          animate={{
                            height: "auto",
                            opacity: 1,
                          }}
                          exit={{
                            height: 0,
                            opacity: 0,
                          }}
                          transition={{
                            duration: 0.3,
                            ease: [0.22, 1, 0.36, 1],
                          }}
                          className="overflow-hidden"
                        >
                          <div className="ml-10 border-b border-white/5 pb-3 pt-2">
                            {l.dropdown.map((item, subIndex) => (
                              <Link
                                key={item.href}
                                to={item.href}
                                onClick={() => {
                                  setOpen(false);
                                  setMobileDropdown(null);
                                }}
                                className="
                      group
                      flex
                      items-center
                      justify-between
                      py-3
                      text-lg
                      font-medium
                      text-zinc-400
                      hover:text-white
                      transition-colors
                    "
                              >
                                <span className="flex items-center gap-3">
                                  <span className="font-mono text-[10px] text-brand/50">
                                    0{subIndex + 1}
                                  </span>

                                  {item.label}
                                </span>

                                <span
                                  className="
                        text-white/20
                        group-hover:text-white/70
                        group-hover:translate-x-1
                        transition-all
                      "
                                >
                                  →
                                </span>
                              </Link>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </nav>


            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="p-8 border-t border-white/10"
            >
              <a
                href="https://course.onestockacademy.com"
                data-testid="nav-enroll-btn"
                className="
    block
    whitespace-nowrap
    bg-paper
    text-ink
    font-mono
    text-[10px] sm:text-[11px]
    uppercase
    tracking-[0.12em] sm:tracking-[0.18em]
    px-3 py-2 sm:px-5 sm:py-2.5
    hover:bg-white
    transition-colors
    rounded-full
  "
              >
                Enroll Now
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
