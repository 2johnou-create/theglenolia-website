"""Company identification shared by the public website footers."""

OPERATOR_NAME = 'Paxton Australia Pty Ltd'
OPERATOR_ABN = '59 688 923 337'

OPERATOR_LABEL = {
    'en-AU': 'Operated by',
    'zh-Hant': '營運公司',
    'ja': '運営会社',
}


def company_details(language='en-AU'):
    return (
        f'<p class="footer-company" lang="{language}">{OPERATOR_LABEL[language]} '
        f'<span lang="en-AU">{OPERATOR_NAME}</span><br>'
        f'<span lang="en-AU">ABN {OPERATOR_ABN}</span></p>'
    )
