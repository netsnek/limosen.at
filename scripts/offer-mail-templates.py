#!/usr/bin/env python3
"""The offer's five mails, in four languages, from this brand's booking confirmation.

    ./scripts/offer-mail-templates.py build                            # write the twenty files
    EMAILWERK_AUTH='user:pass' ./scripts/offer-mail-templates.py push  # dry run against emailwerk
    EMAILWERK_AUTH='user:pass' ./scripts/offer-mail-templates.py push --commit

The pylon sends five mails about a ride's offer (taxi-app, src/mail/offers.ts):
the offer with its PDF and the two links, the confirmation, the decline, the
expiry, and the invoice with its PDF. Each one is this brand's booking
confirmation of the same language (`<brand>-<lang>-confirmation.html`) with the
offer's content in place of the enquiry's: the same header, the same title
block, the same contact line and footer, the same typography, never a new
design. `build` rewrites the twenty files from the four frames, so a change
to the frame is carried into every offer mail by running it again, and the
files stay in git as the source the rows on emailwerk are pushed from.

The office hears about a confirmation, a decline and an expiry as a copy of
the German template with the WhatsApp copy block on top (the block the
booking request carries), rendered when the pylon sets `office`. The rows
are not public: only the pylon sends them, authenticated, naming the
recipient. `push` creates or updates the rows by their description and
writes their ids into `ids.json`, the subjects into `subjects.json`, both
next to the booking pair's entries.
"""

import base64
import json
import os
import pathlib
import re
import sys
import urllib.error
import urllib.request

# --------------------------------------------------------------------------
# The brand
# --------------------------------------------------------------------------

PREFIX = "limosen"            # file name stem, limosen or krc
COMPANY = "LIMOSEN"          # the copy block's first word
DESCRIPTION = "Limosen"  # the description prefix on emailwerk, "Limosen" or "KRC"
USER_AGENT = "limosen-offer-mail-templates"

API = os.environ.get("EMAILWERK_URL", "https://emailwerk.com/graphql")
AUTH = os.environ.get("EMAILWERK_AUTH", "")
# office@snek.at, the sender the booking pair uses.
SENDER_ID = os.environ.get("EMAILWERK_SENDER", "cmsmhy0ag004drb2pzezqi0v2")

HERE = pathlib.Path(__file__).resolve().parent.parent
MAILDIR = pathlib.Path(os.environ.get("MAIL_TEMPLATE_DIR", HERE / "mail-templates"))

LANGUAGES = ["de", "en", "tr", "ar"]
EVENTS = ["offer", "offer-confirmed", "offer-declined", "offer-expired", "invoice"]

# Every value the pylon hands over (src/mail/offers.ts, offerMailValues).
# None is required, an undeclared variable renders empty.
VARIABLES = [
    "event", "locale", "office",
    "code", "bookingCode", "returnCode", "number", "documentName",
    "date", "time", "pickupDateTime", "pickupAddress", "destinationAddress", "returnDate", "returnTime",
    "firstName", "lastName", "name", "email", "phone",
    "total", "totalAmount",
    "validUntil", "validUntilDate", "validUntilTime",
    "confirmUrl", "declineUrl", "documentUrl",
    "statusDate", "statusTime", "year",
]

# --------------------------------------------------------------------------
# The words
# --------------------------------------------------------------------------

# {brand} is the frame's own brand link, taken from its intro paragraph.
TEXT = {
    "de": {
        "offer": {
            "subject": "Angebot {{number}} für Ihre Fahrt {{code}}",
            "title": "Ihr Angebot",
            "intro": "Vielen Dank für Ihre Anfrage bei {brand}. Anbei erhalten Sie unser Angebot <strong>{{number}}</strong> für Ihre Fahrt <strong>{{code}}</strong> als PDF. Bitte bestätigen Sie das Angebot bis <strong>{{validUntil}}</strong> über den Link unten. Danach verfällt es und die Fahrt wird nicht durchgeführt.",
            "confirm": "Angebot bestätigen",
            "decline": "Angebot ablehnen",
            "links": "Falls die Schaltflächen nicht funktionieren, öffnen Sie diese Adresse:",
            "open": "Angebot als PDF öffnen",
        },
        "offer-confirmed": {
            "subject": "Fahrt {{code}} bestätigt",
            "title": "Fahrt bestätigt",
            "intro": "Vielen Dank, Sie haben unser Angebot <strong>{{number}}</strong> für Ihre Fahrt <strong>{{code}}</strong> am {{statusDate}} um {{statusTime}} bestätigt. Die Fahrt ist damit für Sie gebucht. Sobald ein Fahrer zugewiesen ist, erhalten Sie eine weitere Nachricht von {brand}.",
        },
        "offer-declined": {
            "subject": "Angebot {{number}} abgelehnt, Fahrt {{code}} storniert",
            "title": "Angebot abgelehnt",
            "intro": "Sie haben unser Angebot <strong>{{number}}</strong> für die Fahrt <strong>{{code}}</strong> abgelehnt. Die Fahrt ist damit storniert. Wenn wir Ihnen ein anderes Angebot machen dürfen, melden Sie sich gerne bei {brand}.",
        },
        "offer-expired": {
            "subject": "Angebot {{number}} verfallen, Fahrt {{code}} storniert",
            "title": "Angebot verfallen",
            "intro": "Unser Angebot <strong>{{number}}</strong> für die Fahrt <strong>{{code}}</strong> wurde bis {{validUntil}} nicht bestätigt und ist leider verfallen. Die Fahrt wurde storniert. Wenn Sie die Fahrt weiterhin wünschen, melden Sie sich bitte bei {brand}, wir machen Ihnen gerne ein neues Angebot.",
        },
        "invoice": {
            "subject": "Rechnung {{number}} für Ihre Fahrt {{code}}",
            "title": "Ihre Rechnung",
            "intro": "Vielen Dank für Ihre Fahrt <strong>{{code}}</strong> mit {brand}. Anbei erhalten Sie unsere Rechnung <strong>{{number}}</strong> als PDF. Sie können die Rechnung auch über die Schaltfläche unten abrufen.",
            "open": "Rechnung öffnen",
        },
        "rows": {
            "offer": "Angebot", "invoice": "Rechnung", "booking": "Buchung", "outbound": "Hinfahrt", "return": "Rückfahrt",
            "total": "Gesamtpreis", "validUntil": "Gültig bis", "confirmedAt": "Bestätigt am", "declinedAt": "Abgelehnt am",
            "expiredAt": "Verfallen am", "notInSystem": "noch nicht im System",
        },
        "copy": {"heading": "Zum Kopieren und Weiterleiten", "whatsapp": "Per WhatsApp weiterleiten",
                 "offer-confirmed": "Angebot bestätigt", "offer-declined": "Angebot abgelehnt", "offer-expired": "Angebot verfallen"},
    },
    "en": {
        "offer": {
            "subject": "Offer {{number}} for your ride {{code}}",
            "title": "Your offer",
            "intro": "Thank you for your enquiry with {brand}. Please find our offer <strong>{{number}}</strong> for your ride <strong>{{code}}</strong> attached as a PDF. Please confirm the offer by <strong>{{validUntil}}</strong> using the link below. After that it expires and the ride will not take place.",
            "confirm": "Confirm offer",
            "decline": "Decline offer",
            "links": "If the buttons do not work, open this address:",
            "open": "Open the offer as PDF",
        },
        "offer-confirmed": {
            "subject": "Ride {{code}} confirmed",
            "title": "Ride confirmed",
            "intro": "Thank you, you confirmed our offer <strong>{{number}}</strong> for your ride <strong>{{code}}</strong> on {{statusDate}} at {{statusTime}}. The ride is booked for you. As soon as a driver is assigned you will receive another message from {brand}.",
        },
        "offer-declined": {
            "subject": "Offer {{number}} declined, ride {{code}} cancelled",
            "title": "Offer declined",
            "intro": "You declined our offer <strong>{{number}}</strong> for the ride <strong>{{code}}</strong>. The ride is cancelled. If we may make you another offer, please get in touch with {brand}.",
        },
        "offer-expired": {
            "subject": "Offer {{number}} expired, ride {{code}} cancelled",
            "title": "Offer expired",
            "intro": "Our offer <strong>{{number}}</strong> for the ride <strong>{{code}}</strong> was not confirmed by {{validUntil}} and has unfortunately expired. The ride has been cancelled. If you still wish to travel, please get in touch with {brand} and we will gladly make you a new offer.",
        },
        "invoice": {
            "subject": "Invoice {{number}} for your ride {{code}}",
            "title": "Your invoice",
            "intro": "Thank you for your ride <strong>{{code}}</strong> with {brand}. Please find our invoice <strong>{{number}}</strong> attached as a PDF. You can also open the invoice using the button below.",
            "open": "Open invoice",
        },
        "rows": {
            "offer": "Offer", "invoice": "Invoice", "booking": "Booking", "outbound": "Outbound", "return": "Return",
            "total": "Total", "validUntil": "Valid until", "confirmedAt": "Confirmed on", "declinedAt": "Declined on",
            "expiredAt": "Expired on", "notInSystem": "not yet in the system",
        },
    },
    "tr": {
        "offer": {
            "subject": "{{code}} yolculuğunuz için {{number}} numaralı teklif",
            "title": "Teklifiniz",
            "intro": "{brand} ile iletişime geçtiğiniz için teşekkür ederiz. <strong>{{code}}</strong> yolculuğunuz için <strong>{{number}}</strong> numaralı teklifimizi ekte PDF olarak bulabilirsiniz. Lütfen teklifi <strong>{{validUntil}}</strong> tarihine kadar aşağıdaki bağlantı üzerinden onaylayın. Bu tarihten sonra teklif geçerliliğini yitirir ve yolculuk gerçekleştirilmez.",
            "confirm": "Teklifi onayla",
            "decline": "Teklifi reddet",
            "links": "Düğmeler çalışmazsa şu adresi açın:",
            "open": "Teklifi PDF olarak aç",
        },
        "offer-confirmed": {
            "subject": "{{code}} yolculuğu onaylandı",
            "title": "Yolculuk onaylandı",
            "intro": "Teşekkür ederiz, <strong>{{code}}</strong> yolculuğunuz için <strong>{{number}}</strong> numaralı teklifimizi {{statusDate}} {{statusTime}} tarihinde onayladınız. Yolculuğunuz sizin için rezerve edildi. Bir sürücü atanır atanmaz {brand} tarafından yeni bir mesaj alacaksınız.",
        },
        "offer-declined": {
            "subject": "{{number}} numaralı teklif reddedildi, {{code}} yolculuğu iptal edildi",
            "title": "Teklif reddedildi",
            "intro": "<strong>{{code}}</strong> yolculuğu için <strong>{{number}}</strong> numaralı teklifimizi reddettiniz. Yolculuk iptal edildi. Size başka bir teklif sunmamızı isterseniz lütfen {brand} ile iletişime geçin.",
        },
        "offer-expired": {
            "subject": "{{number}} numaralı teklifin süresi doldu, {{code}} yolculuğu iptal edildi",
            "title": "Teklifin süresi doldu",
            "intro": "<strong>{{code}}</strong> yolculuğu için <strong>{{number}}</strong> numaralı teklifimiz {{validUntil}} tarihine kadar onaylanmadığı için maalesef geçerliliğini yitirdi. Yolculuk iptal edildi. Yolculuğu hâlâ istiyorsanız lütfen {brand} ile iletişime geçin, size memnuniyetle yeni bir teklif sunarız.",
        },
        "invoice": {
            "subject": "{{code}} yolculuğunuz için {{number}} numaralı fatura",
            "title": "Faturanız",
            "intro": "{brand} ile yaptığınız <strong>{{code}}</strong> yolculuğu için teşekkür ederiz. <strong>{{number}}</strong> numaralı faturamızı ekte PDF olarak bulabilirsiniz. Faturayı aşağıdaki düğme üzerinden de açabilirsiniz.",
            "open": "Faturayı aç",
        },
        "rows": {
            "offer": "Teklif", "invoice": "Fatura", "booking": "Rezervasyon", "outbound": "Gidiş", "return": "Dönüş",
            "total": "Toplam", "validUntil": "Geçerlilik", "confirmedAt": "Onay tarihi", "declinedAt": "Ret tarihi",
            "expiredAt": "Süre sonu", "notInSystem": "henüz sistemde değil",
        },
    },
    "ar": {
        "offer": {
            "subject": "العرض {{number}} لرحلتك {{code}}",
            "title": "عرضك",
            "intro": "شكرًا لاستفسارك لدى {brand}. تجد مرفقًا عرضنا <strong>{{number}}</strong> لرحلتك <strong>{{code}}</strong> بصيغة PDF. يرجى تأكيد العرض حتى <strong>{{validUntil}}</strong> عبر الرابط أدناه. بعد ذلك ينتهي العرض ولن تُنفَّذ الرحلة.",
            "confirm": "تأكيد العرض",
            "decline": "رفض العرض",
            "links": "إذا لم تعمل الأزرار، افتح هذا العنوان:",
            "open": "فتح العرض بصيغة PDF",
        },
        "offer-confirmed": {
            "subject": "تم تأكيد الرحلة {{code}}",
            "title": "تم تأكيد الرحلة",
            "intro": "شكرًا لك، لقد أكدت عرضنا <strong>{{number}}</strong> لرحلتك <strong>{{code}}</strong> بتاريخ {{statusDate}} الساعة {{statusTime}}. بذلك تم حجز الرحلة لك. بمجرد تعيين سائق ستصلك رسالة أخرى من {brand}.",
        },
        "offer-declined": {
            "subject": "تم رفض العرض {{number}}، تم إلغاء الرحلة {{code}}",
            "title": "تم رفض العرض",
            "intro": "لقد رفضت عرضنا <strong>{{number}}</strong> للرحلة <strong>{{code}}</strong>. بذلك تم إلغاء الرحلة. إذا رغبت في عرض آخر، يسعدنا تواصلك مع {brand}.",
        },
        "offer-expired": {
            "subject": "انتهت صلاحية العرض {{number}}، تم إلغاء الرحلة {{code}}",
            "title": "انتهت صلاحية العرض",
            "intro": "لم يتم تأكيد عرضنا <strong>{{number}}</strong> للرحلة <strong>{{code}}</strong> حتى {{validUntil}}، وللأسف انتهت صلاحيته. تم إلغاء الرحلة. إذا كنت لا تزال ترغب في الرحلة، يرجى التواصل مع {brand} وسنقدم لك عرضًا جديدًا بكل سرور.",
        },
        "invoice": {
            "subject": "الفاتورة {{number}} لرحلتك {{code}}",
            "title": "فاتورتك",
            "intro": "شكرًا لرحلتك <strong>{{code}}</strong> مع {brand}. تجد مرفقًا فاتورتنا <strong>{{number}}</strong> بصيغة PDF. يمكنك أيضًا فتح الفاتورة عبر الزر أدناه.",
            "open": "فتح الفاتورة",
        },
        "rows": {
            "offer": "العرض", "invoice": "الفاتورة", "booking": "الحجز", "outbound": "الذهاب", "return": "العودة",
            "total": "الإجمالي", "validUntil": "صالح حتى", "confirmedAt": "تم التأكيد في", "declinedAt": "تم الرفض في",
            "expiredAt": "انتهى في", "notInSystem": "ليس في النظام بعد",
        },
    },
}

# --------------------------------------------------------------------------
# The pieces
# --------------------------------------------------------------------------

GOLD = "#d4af37"
INK = "#1b1b1b"
TEXT_COLOR = "#e6e6e6"
FONT = "arial, 'helvetica neue', helvetica, sans-serif"


def li(label, value, rtl):
    """One row of the details list, in the frame's own style."""
    return f'<li style="margin-bottom:8px;"><strong>{label}: </strong>{value}</li>'


def rows_for(event, lang, rtl):
    r = TEXT[lang]["rows"]
    out = []
    if event == "invoice":
        out.append('{% if number is not empty %}' + li(r["invoice"], "{{number}}", rtl) + '{% endif %}')
    else:
        out.append('{% if number is not empty %}' + li(r["offer"], "{{number}}", rtl) + '{% endif %}')
    out.append(li(r["booking"], '{% if bookingCode is not empty %}{{bookingCode}}{% else %}' + r["notInSystem"] + '{% endif %}', rtl))
    out.append('{% if date is not empty %}'
               + li(r["outbound"] + '{% if code is not empty %} {{code}}{% endif %}',
                    '{{date}} {{time}}{% if pickupAddress is not empty %}, <span dir="ltr">{{pickupAddress}} &rarr; {{destinationAddress}}</span>{% endif %}', rtl)
               + '{% endif %}')
    out.append('{% if returnDate is not empty %}'
               + li(r["return"] + '{% if returnCode is not empty %} {{returnCode}}{% endif %}',
                    '{{returnDate}} {{returnTime}}{% if destinationAddress is not empty %}, <span dir="ltr">{{destinationAddress}} &rarr; {{pickupAddress}}</span>{% endif %}', rtl)
               + '{% endif %}')
    out.append('{% if total is not empty %}' + li(r["total"], "{{total}}", rtl) + '{% endif %}')
    if event == "offer":
        out.append('{% if validUntil is not empty %}' + li(r["validUntil"], "{{validUntil}}", rtl) + '{% endif %}')
    elif event == "offer-confirmed":
        out.append('{% if statusDate is not empty %}' + li(r["confirmedAt"], "{{statusDate}} {{statusTime}}", rtl) + '{% endif %}')
    elif event == "offer-declined":
        out.append('{% if statusDate is not empty %}' + li(r["declinedAt"], "{{statusDate}} {{statusTime}}", rtl) + '{% endif %}')
    elif event == "offer-expired":
        out.append('{% if validUntil is not empty %}' + li(r["validUntil"], "{{validUntil}}", rtl) + '{% endif %}')
    return "\n".join(" " * 38 + line for line in out)


def button(label, href_var, primary, rtl):
    """A button in the frame's style: the gold of the WhatsApp button's place, dark text on gold for the confirm, gold on dark for the rest."""
    bg = GOLD if primary else INK
    color = INK if primary else GOLD
    border = f"border: 1px solid {GOLD};" if not primary else ""
    return (
        f'<td align="center" bgcolor="{bg}" style="margin: 0; padding: 12px 24px; border-radius: 4px; background-color: {bg}; {border}">'
        f'<a href="{{{{{href_var}}}}}" target="_blank" style="display: inline-block; font-family: {FONT}; font-size: 14px; font-weight: bold; color: {color}; text-decoration: none;">{label}</a>'
        f'</td>'
    )


def buttons_block(cells, rtl):
    gap = '<td style="width: 12px; font-size: 0;">&nbsp;</td>'
    align = "right" if rtl else "left"
    return (
        f'<table cellpadding="0" cellspacing="0" role="presentation" align="{align}" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-collapse: separate; border-spacing: 0px; margin-top: 16px;">'
        f'<tr>{gap.join(cells)}</tr></table>'
    )


def link_lines(lang, rtl):
    t = TEXT[lang]["offer"]
    align = "right" if rtl else "left"
    return (
        f'<p style="margin: 16px 0 0 0; font-family: {FONT}; font-size: 12px; line-height: 18px; color: {TEXT_COLOR}; text-align: {align};">{t["links"]}<br />'
        f'<a href="{{{{confirmUrl}}}}" dir="ltr" class="hover-link" style="color: {GOLD}; text-decoration: underline; word-break: break-all;">{{{{confirmUrl}}}}</a></p>'
    )


def office_block():
    """The booking request's copy block, with the offer's summary, rendered for the office only."""
    lines = (
        '{% set copySummary = "' + COMPANY + ' " ~ (event == "OFFER_CONFIRMED" ? "Angebot bestaetigt" : (event == "OFFER_DECLINED" ? "Angebot abgelehnt" : "Angebot verfallen")) ~ "\\n"\n'
        '  ~ (bookingCode is not empty ? "Buchung " ~ bookingCode ~ "\\n" : "")\n'
        '  ~ (number is not empty ? "Angebot " ~ number ~ "\\n" : "")\n'
        '  ~ (name is not empty ? "Name: " ~ name ~ "\\n" : "")\n'
        '  ~ (phone is not empty ? "Tel: " ~ phone ~ "\\n" : "")\n'
        '  ~ (email is not empty ? "Mail: " ~ email ~ "\\n" : "")\n'
        '  ~ (date is not empty ? "Hinfahrt" ~ (code is not empty ? " " ~ code : "") ~ ": " ~ date ~ (time is not empty ? " " ~ time : "") ~ "\\n" : "")\n'
        '  ~ (returnDate is not empty ? "Rueckfahrt" ~ (returnCode is not empty ? " " ~ returnCode : "") ~ ": " ~ returnDate ~ (returnTime is not empty ? " " ~ returnTime : "") ~ "\\n" : "")\n'
        '  ~ (pickupAddress is not empty ? "Von: " ~ pickupAddress ~ "\\n" : "")\n'
        '  ~ (destinationAddress is not empty ? "Nach: " ~ destinationAddress ~ "\\n" : "")\n'
        '  ~ (total is not empty ? "Preis: " ~ total ~ "\\n" : "")\n'
        '  ~ (statusDate is not empty ? "Am: " ~ statusDate ~ " " ~ statusTime ~ "\\n" : "") %}'
    )
    de = TEXT["de"]["copy"]
    return (
        '{% if office is not empty %}\n'
        '<!-- The office\'s copy: the copy block of the booking request, one\n'
        '     preformatted block a triple click or a long press selects whole,\n'
        '     and a WhatsApp link that already carries the same text. Rendered\n'
        '     only when the pylon sends the office its copy (office = 1). -->\n'
        + lines + '\n'
        f'<p style="margin: 0 0 6px 0; -webkit-text-size-adjust: none; -ms-text-size-adjust: none; mso-line-height-rule: exactly; font-family: {FONT}; font-size: 13px; line-height: 18px; color: {GOLD}; text-transform: uppercase; letter-spacing: 1px;">{de["heading"]}</p>\n'
        f'<pre style="margin: 0 0 12px 0; padding: 14px; background-color: #111111; border: 1px solid {GOLD}; border-radius: 4px; font-family: \'courier new\', courier, monospace; font-size: 13px; line-height: 19px; color: {TEXT_COLOR}; white-space: pre-wrap; word-break: break-word;">{{{{copySummary}}}}</pre>\n'
        '<table cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-collapse: separate; border-spacing: 0px; margin-bottom: 20px;"><tr>'
        f'<td align="center" bgcolor="#25d366" style="margin: 0; padding: 10px 20px; border-radius: 4px; background-color: #25d366;">'
        f'<a href="https://wa.me/?text={{{{copySummary|url_encode}}}}" target="_blank" style="display: inline-block; font-family: {FONT}; font-size: 14px; font-weight: bold; color: #ffffff; text-decoration: none;">{de["whatsapp"]}</a>'
        '</td></tr></table>\n'
        '{% endif %}\n'
    )


# --------------------------------------------------------------------------
# The frame
# --------------------------------------------------------------------------

TITLE_RE = re.compile(r"<title>.*?</title>", re.S)
H1_RE = re.compile(r"(<h1\b[^>]*>)(.*?)(</h1>)", re.S)
NOW_RE = re.compile(r'\{\{\s*"now"\|date\([^)]*\)\s*\}\}')
P_OPEN_RE = re.compile(r"<p\b[^>]*>", re.S)
UL_RE = re.compile(r"(<ul\b[^>]*>)(.*?)(</ul>)", re.S)
BRAND_LINK_RE = re.compile(r"<a\s+href=\"https://[^\"]+/\"[^>]*>.*?</a\s*>", re.S)


def build_one(frame, lang, event):
    words = TEXT[lang][event]
    rtl = lang == "ar"
    html = frame

    # The document title is the plain title: a variable would not render there.
    html = TITLE_RE.sub("<title>" + words["title"] + "</title>", html, count=1)

    html = H1_RE.sub(lambda m: m.group(1) + words["title"] + m.group(3), html, count=1)

    # The intro: the paragraph after the date paragraph, its brand link kept.
    now = NOW_RE.search(html)
    if not now:
        raise SystemExit(f"{lang}: no date paragraph in the frame")
    close = html.index("</p>", now.end())
    open_match = P_OPEN_RE.search(html, close)
    intro_end = html.index("</p>", open_match.end())
    intro_html = html[open_match.end():intro_end]
    brand = BRAND_LINK_RE.search(intro_html)
    if not brand:
        raise SystemExit(f"{lang}: no brand link in the frame's intro")
    brand_link = re.sub(r"\s+", " ", brand.group(0))
    intro = words["intro"].replace("{brand}", brand_link)
    html = html[:open_match.end()] + "\n" + " " * 38 + intro + "\n" + " " * 36 + html[intro_end:]

    # The details: the list, with the office block before it and the buttons after it.
    ul = UL_RE.search(html)
    if not ul:
        raise SystemExit(f"{lang}: no list in the frame")
    parts = []
    if event in ("offer-confirmed", "offer-declined", "offer-expired") and lang == "de":
        parts.append(office_block())
    parts.append(ul.group(1) + "\n" + rows_for(event, lang, rtl) + "\n" + " " * 36 + ul.group(3))
    if event == "offer":
        parts.append(buttons_block([button(words["confirm"], "confirmUrl", True, rtl), button(words["decline"], "declineUrl", False, rtl)], rtl))
        # The PDF is attached where emailwerk takes attachments and linked
        # here in any case, so a customer on a deployment without them
        # still reaches the document.
        parts.append("{% if documentUrl is not empty %}" + buttons_block([button(words["open"], "documentUrl", False, rtl)], rtl) + "{% endif %}")
        parts.append(link_lines(lang, rtl))
    elif event == "invoice":
        parts.append("{% if documentUrl is not empty %}" + buttons_block([button(words["open"], "documentUrl", True, rtl)], rtl) + "{% endif %}")
    html = html[:ul.start()] + "\n".join(parts) + html[ul.end():]
    return html


def build():
    subjects_path = MAILDIR / "subjects.json"
    subjects = json.loads(subjects_path.read_text(encoding="utf-8")) if subjects_path.exists() else {}
    for lang in LANGUAGES:
        frame = (MAILDIR / f"{PREFIX}-{lang}-confirmation.html").read_text(encoding="utf-8")
        for event in EVENTS:
            base = f"{PREFIX}-{lang}-{event}"
            out = MAILDIR / f"{base}.html"
            out.write_text(build_one(frame, lang, event), encoding="utf-8")
            subjects[base] = TEXT[lang][event]["subject"]
            print(f"  wrote {out.name} ({out.stat().st_size} bytes)")
    subjects_path.write_text(json.dumps(subjects, indent=1, ensure_ascii=False) + "\n", encoding="utf-8")
    print(f"  subjects in {subjects_path.name}")


# --------------------------------------------------------------------------
# emailwerk
# --------------------------------------------------------------------------

def call(query, variables):
    if not AUTH:
        sys.exit("EMAILWERK_AUTH is not set (expects 'user:pass')")
    request = urllib.request.Request(
        API,
        data=json.dumps({"query": query, "variables": variables}).encode(),
        headers={
            "Content-Type": "application/json",
            "Authorization": "Basic " + base64.b64encode(AUTH.encode()).decode(),
            "User-Agent": USER_AGENT,
        },
    )
    try:
        with urllib.request.urlopen(request, timeout=60) as response:
            payload = json.load(response)
    except urllib.error.HTTPError as err:
        sys.exit(f"HTTP {err.code}: {err.read().decode()[:300]}")
    if payload.get("errors"):
        sys.exit("GraphQL: " + json.dumps(payload["errors"])[:400])
    return payload["data"]


def description_of(lang, event):
    kind = {"offer": "Offer", "offer-confirmed": "Offer Confirmed", "offer-declined": "Offer Declined",
            "offer-expired": "Offer Expired", "invoice": "Invoice"}[event]
    return f"{DESCRIPTION} {lang.upper()} {kind}"


def existing():
    data = call("query($a: TemplateListArgsInput){ templates(args:$a){ nodes { id description } } }", {"a": {"first": 200}})
    return {n["description"]: n["id"] for n in data["templates"]["nodes"]
            if (n.get("description") or "").startswith(DESCRIPTION + " ")}


def push(commit):
    subjects = json.loads((MAILDIR / "subjects.json").read_text(encoding="utf-8"))
    ids_path = MAILDIR / "ids.json"
    ids = json.loads(ids_path.read_text(encoding="utf-8")) if ids_path.exists() else {}
    known = existing() if commit else {}
    for lang in LANGUAGES:
        for event in EVENTS:
            base = f"{PREFIX}-{lang}-{event}"
            body = (MAILDIR / f"{base}.html").read_text(encoding="utf-8")
            description = description_of(lang, event)
            payload = {
                "description": description,
                "content": body,
                "engine": "TWIG",
                "senderId": SENDER_ID,
                # Not public: the pylon sends these, authenticated, naming
                # the recipient. Nothing a visitor could post.
                "isPublic": False,
                "verifyReplyTo": False,
                "variables": [{"name": v, "type": "STRING", "isRequired": False, "isConstant": False} for v in VARIABLES],
                # No recipient of its own: the pylon names it on every send.
                "envelope": {"subject": subjects[base], "to": []},
            }
            if not commit:
                print(f"  would write {description:34} {len(body):6} bytes")
                continue
            if description in known:
                call("mutation($a: TemplateUpdateArgsInput!){ templateUpdate(args:$a){ id } }", {"a": {"id": known[description], **payload}})
                ids[base] = known[description]
                print(f"  updated {description:34} {ids[base]}")
            else:
                data = call("mutation($a: TemplateCreateInput!){ templateCreate(args:$a){ id } }", {"a": payload})
                ids[base] = data["templateCreate"]["id"]
                print(f"  created {description:34} {ids[base]}")
    if not commit:
        print("\ndry run, nothing was written. Add --commit.")
        return
    ids_path.write_text(json.dumps(ids, indent=2) + "\n", encoding="utf-8")
    print(f"\nids written to {ids_path}")
    print("\nthe [vars] for the brand's wrangler file:")
    for lang in LANGUAGES:
        for event in EVENTS:
            var = "MAIL_TEMPLATE_" + event.upper().replace("-", "_") + "_" + lang.upper()
            print(f'{var} = "{ids[f"{PREFIX}-{lang}-{event}"]}"')


def main():
    command = sys.argv[1] if len(sys.argv) > 1 else ""
    if command == "build":
        build()
    elif command == "push":
        push("--commit" in sys.argv)
    else:
        sys.exit(__doc__)


if __name__ == "__main__":
    main()
