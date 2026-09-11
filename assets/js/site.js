/* Recio Solutions LLC. Small, dependency free. Every business fact renders
   in raw HTML so the page reads without script. */
(function () {
  "use strict";

  // Mobile nav
  var burger = document.getElementById("burger");
  var nav = document.getElementById("nav");
  if (burger && nav) {
    burger.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      burger.setAttribute("aria-expanded", open ? "true" : "false");
      burger.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    });
    nav.addEventListener("click", function (e) {
      if (e.target.tagName === "A") {
        nav.classList.remove("open");
        burger.setAttribute("aria-expanded", "false");
      }
    });
  }

  // Footer year
  var yr = document.getElementById("yr");
  if (yr) { yr.textContent = new Date().getFullYear(); }

  /* ------------------------------------------------------------------
     Quote form -> Avolv lead inbox.
     Same public endpoint and payload shape as Keep It Clean and Gil
     Pool Service. Tenant slug must match Team.slug in the Avolv DB
     exactly: recio-solutions
  ------------------------------------------------------------------ */
  var AVOLV_ENDPOINT =
    "https://api.avolv.ai/api/marketing/lead-ingestion?business=recio-solutions";
  var AVOLV_SOURCE = "recio-solutions-website";
  var PHONE_DISPLAY = "(321) 490-5997";

  var form = document.getElementById("quoteForm");
  if (form) {
    var btn = document.getElementById("quoteSubmit");
    var msg = document.getElementById("formMsg");

    var say = function (text, isError) {
      if (!msg) { return; }
      msg.textContent = text;
      msg.hidden = false;
      msg.className = isError ? "form-note form-err" : "form-note";
    };

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      var d = new FormData(form);
      var get = function (k) { return (d.get(k) || "").toString().trim(); };

      // Honeypot. Bots fill hidden fields; people do not.
      if (get("website")) { return; }

      var name = get("name");
      var phone = get("phone");
      var email = get("email");
      if (!name || !phone) {
        say("Please give us at least a name and a phone number.", true);
        return;
      }

      // Fields Avolv has no columns for get folded into notes.
      var noteParts = [];
      if (get("facilityType")) { noteParts.push("Facility type: " + get("facilityType")); }
      if (get("organization")) { noteParts.push("Organization: " + get("organization")); }
      if (get("pickupLocation")) { noteParts.push("Pickup location: " + get("pickupLocation")); }
      if (get("frequency")) { noteParts.push("Frequency: " + get("frequency")); }
      if (get("urgency")) { noteParts.push("Urgency: " + get("urgency")); }
      if (get("volume")) { noteParts.push("Estimated volume: " + get("volume")); }
      if (get("message")) { noteParts.push("Message: " + get("message")); }

      var payload = {
        name: name,
        email: email,
        phone: phone,
        source: AVOLV_SOURCE,
        notes: noteParts.join("\n"),
        metadata: {
          source: AVOLV_SOURCE,
          business: "recio-solutions",
          serviceType: get("facilityType") || "medical-courier",
          propertyAddress: get("pickupLocation") || ""
        }
      };

      if (btn) { btn.disabled = true; btn.textContent = "Sending..."; }

      fetch(AVOLV_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      })
        .then(function (res) {
          if (res.ok) {
            window.location.href = "/thank-you/";
            return;
          }
          throw new Error("status " + res.status);
        })
        .catch(function () {
          if (btn) { btn.disabled = false; btn.textContent = "Request a Quote"; }
          say(
            "Something went wrong sending your request. Please call us at " +
              PHONE_DISPLAY + " and we will take it over the phone.",
            true
          );
        });
    });
  }
})();
