function renderContactFullModeHtml(contactName, contactEmail, contactPhone, contactBadges) {
  return /*html*/ `
    <div class="contact-full-mode-header">
      <div id="id-mobile-dot-menu" class="mobile-dot-menu join-button" onclick="openContactEditMenu()">
    <img id="dot-menu-img" src="/img/dot-menu.svg" alt="">
    </div>
    <div id="id-contacts-arrow-exit" class="contacts-arrow-exit" onclick="HideFullViewShowContactList()">
    <img src="/img/arrow-left-line.svg" alt="">
  </div>
      <div id="id-contact-full-mode-badges" class="contact-full-mode-badges">${contactBadges}</div>
      <div class="contact-full-mode-name-edit-section">
        <div class="contact-full-mode-name">${contactName}</div>
        <div class="contact-full-mode-edit">
          <button class="contact-full-mode-edit-contact" onclick="openContactForm('editContact')">
            <div class="edit-btn-img"></div>
            <div>Edit</div>
          </button>
        <button class="contact-full-mode-delete-contact" onclick="deleteContact()">
            <div class="delete-btn-img" ></div>
            <div>Delete</div>
          </button>
        </div>
      </div>
    </div>
      <div class="contact-full-mode-data">
        <div class="contact-full-mode-data-headline">Contact Information</div>
        <div class="contact-full-mode-data-email-headline">Email</div>
        <div id="id-contact-full-mode-data-email" class="contact-full-mode-data-email">${contactEmail}</div>
        <div class="contact-full-mode-data-phone-headline">Phone</div>
        <div class="contact-full-mode-data-phone">${contactPhone}</div>
      </div>
  
  `;
}

function renderLetterSectionHTML(firstLetter) {
  return /*html*/ `
  <div class="contact-list-first-letter">${firstLetter}</div>
  <div class="contact-list-letter-parting-line"></div>
  `;
}

function renderContactHtml(contactBadges, contactName, contactEmail, i) {
  return /*html*/ `
  <div id="id-contact-list-item${i}" class="contact-list-item" onclick="openContact('${contactEmail}',${i})">
    <div id="id-contact-list-badges${i}" class="contact-list-badges">${contactBadges}</div>
    <div id="id-contact-list-name-email${i}" class="contact-list-name-email">
      <div id="id-contact-list-name${i}" class="contact-list-name">${contactName}</div>
      <div id="id-contact-list-email${i}" class="contact-list-email">${contactEmail}</div>
    </div>
  </div>
  `;
}

function renderContactEditMenuMobile() {
  return /*html*/ `
  <div id="id-contact-full-mode-edit-mobile" class="contact-full-mode-edit-mobile hide">
          <button class="contact-full-mode-edit-contact" onclick="openContactForm('editContact')">
            <div class="edit-btn-img"></div>
            <div>Edit</div>
          </button>
        <button class="contact-full-mode-delete-contact" onclick="deleteContact()">
            <div class="delete-btn-img" ></div>
            <div>Delete</div>
          </button>
        </div>`;
}
