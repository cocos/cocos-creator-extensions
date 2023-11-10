'use strict';
module.exports = {
    open_panel: 'Translate',
    'localization-editor': 'Localization Editor',
    description: 'Localize editor',
    service_provider: 'Translation service provider',
    collection: 'Collect and count',
    language_compilation: 'Compile language',
    select_placeholder: 'Please select',
    unselect_service_tip: 'If no translation service provider is selected, the automatic translation feature will not be supported',
    local_language: 'Local development language:',
    collected_from_resource_files: 'Collect from resource files',
    required: '*required',
    file_no_exist: 'File not exist',
    cannot_empty: 'Cannot be empty',
    common_languages: 'common languages',
    cancel: 'Cancel',
    confirm: 'Confirm',
    ask_delete: 'Whether to delete it?',
    localization_editor_project_config: 'Localization Editor Config For Project',
    localization_editor_editor_config: 'Localization Editor Config For Editor',
    localization_editor_provider_config: 'Localization Editor Translate Provider Configs',
    loading_tips: 'loading...',

    component: {
        help: `https://docs.cocos.com/creator/manual/en/editor/l10n/l10n-label.html`,
        string: 'Text within Label component',
        count: 'The number to get a variant for',
        key: 'Localized key',
    },

    YOUDAO: {
        'zh-CHS': 'Chinese Simplified',
        'zh-CHT': 'Traditional respectively',
    },
    label_inspector: {
        no_origin: 'No original',
        key: 'Key',
        'key:': 'Key:',
        save: 'Save',
        reset: 'Reset',
        saving: 'Saving...',
        cannot_empty: 'Cannot be empty',
        error_tooltip: 'Contains letters, numbers, underscores, hyphens, @, /, +, | \N cannot be any other character',
        exist_media_tooltip: 'This key is the key of media',
        edit: 'Edit',
    },
    build: {
        compress_warning: 'Building failed because the picture with uuid "${a}" and the picture with uuid "${b}" have different settings for Compress Texture. Please keep Compress Texture settings for these pictures consistent.',
        packable_warning: 'Translation failed for the picture with uuid "${uuid}", because it has option Dynamic Atlas turned on.',
        use_polyfill: ' Polyfill script used',
        use_language: 'Language used',
        select_all: 'Select all',
        default_language: 'Default language',
        fallback_language: 'Alternate language',
    },
    home: {
        po_name: 'GNU gettext PO File',
        csv_name: 'Comma-Separated Values',
        xlsx_name: 'Excel File',
        service_provider: 'Service provider',
        collection: 'Collection',
        language_compilation: 'Compile language',
        select_placeholder: 'Select',
        unselect_service_tip: 'If no translation service provider is selected, the automatic translation function will not be supported',
        'local_language:': 'Local development language:',
        collected_from_resource_files: 'Collect from resource files',
        required: '*Required',
        delete: 'Delete',
        preview: 'Preview',
        combine: 'Combine',
        translate: 'Translate',
        complement: 'Complement',
        not_recorded: 'notRecorded',
        collect_and_count: 'Collect and count',
        add_new_language: 'Add new language',
        add: 'Add',
        select: 'Select',
        language: 'Language',
        'language:': 'Language:',
        extname: 'Extension name',
        exclude_path: 'Exclude path',
        language_for_service_provider: 'Language recognized by the service provider',
        dir: 'Directory',
        search_dir: 'Search directory',
        translate_process: 'Translation progress',
        combine_process: 'Compilation progress',
        operation: 'Operation',
        local_language: 'Local development language',
        combine_tooltip: ' Text is calculated by the actual number of words, and resources are calculated by unit of 1',
        translate_tooltip: 'Any entry is calculated in unit 1',
        count: 'Count:',
        collecting: 'Counting',
        unselect: 'No development language selected',
        save: 'Save',
        complete: 'Complete',
        collect_group: 'Collection Group',
        turn_on_tip: 'Please enable Localization Editor tool',
        turn_on: 'Enable Localization Editor',
        turn_off_warning: 'After closing, all translation data and configurations will be cleared. Are you sure you still want to close?',
        turn_off: 'Turn off L10N',
        delete_data: 'Clear data',
        delete_data_warning: 'The translated data will be permanently lost after clearing. Are you sure you want to clear the data?',
        export: 'Export',
        export_all: 'Export All',
    },
    translate: {
        source_string_placeholder: 'Please enter what will be replaced at the URL of the asset',
        dist_string_placeholder: 'Please enter the replaced content at the URL of the asset',
        source_string: 'Search Content:',
        dist_string: 'Replace Content:',
        new_value: 'New Value',
        old_value: 'Origin Value',
        import_po: 'Import PO File',
        export_po: 'Export PO File',
        save: 'Save',
        unfilled: 'Unfilled',
        untranslated: 'Untranslated',
        filled: 'Filled',
        count: 'Count:',
        translate: 'Translate',
        translated: 'Translated',
        key: 'Key',
        'key:': 'Key:',
        jump: 'skip',
        origin: 'Original',
        target: 'Translation',
        import_all: 'Intelligent matching',
        import: 'Import',
        import_file: 'Import File',
        'position:': 'Position:',
        reference_uuid: 'Reference node\'s uuid:',
        variant: 'Variant',
        after_variant: 'After variant applied',
        standard: 'Standard',
        delete_variant: 'Delete variant',
        cancel: 'Cancel',
        confirm: 'Confirm',
        cover: 'Cover',
        conflict_dialog_title: '注意：',
        conflict_dialog_content: 'The following data already exists in [translated], and the original data will disappear after overwriting. Are you sure you want to overwrite?',
        unsaved_warning: 'Does the current translation need to be saved?',
        delete_warning: ' are you sure to delete?',
        auto_import_warning: '{length} files will be matched intelligently.{localLocale} (source language) will be replaced with {targetLocale} (target language)after matching. Are you sure to perform this operation?',
        quit_warning: 'There are unsaved contents, are you sure to exit?',
        import_tab_title: 'Imported Files',
        import_file_conflicts_with_file_warning: 'Unable to import {num} data entries due to key conflicts, how would you like to resolve?',
        saving_tips: 'Ongoing...',
    },
    language_code: {
        'af': 'Afrikaans',
        'af-ZA': 'Afrikaans (South Africa)',
        'af-NA': 'Afrikaans (Namibia)',
        'agq': 'Aghem',
        'agq-CM': 'Aghem (Cameroon)',
        'ak': 'Akan',
        'ak-GH': 'Akan (Ghana)',
        'am': 'Amharic',
        'am-ET': 'Amharic (Ethiopia)',
        'ar': 'Arabic',
        'ar-YE': 'Arabic (Yemen)',
        'ar-TN': 'Arabic (Tunisia)',
        'ar-TD': 'Arabic (Chad)',
        'ar-SY': 'Arabic (Syria)',
        'ar-SS': 'Arabic (South Sudan)',
        'ar-SO': 'Arabic (Somalia)',
        'ar-SD': 'Arabic (Sudan)',
        'ar-SA': 'Arabic (Saudi Arabia)',
        'ar-QA': 'Arabic (Qatar)',
        'ar-PS': 'Arabic (Palestinian Territories)',
        'ar-OM': 'Arabic (Oman)',
        'ar-MR': 'Arabic (Mauritania)',
        'ar-MA': 'Arabic (Morocco)',
        'ar-LY': 'Arabic (Libya)',
        'ar-LB': 'Arabic (Lebanon)',
        'ar-KW': 'Arabic (Kuwait)',
        'ar-KM': 'Arabic (Comoros)',
        'ar-JO': 'Arabic (Jordan)',
        'ar-IQ': 'Arabic (Iraq)',
        'ar-IL': 'Arabic (Israel)',
        'ar-ER': 'Arabic (Eritrea)',
        'ar-EH': 'Arabic (Western Sahara)',
        'ar-EG': 'Arabic (Egypt)',
        'ar-DZ': 'Arabic (Algeria)',
        'ar-DJ': 'Arabic (Djibouti)',
        'ar-BH': 'Arabic (Bahrain)',
        'ar-AE': 'Arabic (United Arab Emirates)',
        'ar-001': 'Modern Standard Arabic',
        'as': 'Assamese',
        'as-IN': 'Assamese (India)',
        'asa': 'Asu',
        'asa-TZ': 'Asu (Tanzania)',
        'ast': 'Asturian',
        'ast-ES': 'Asturian (Spain)',
        'az': 'Azerbaijani',
        'az-Latn-AZ': 'Azerbaijani (Latin, Azerbaijan)',
        'az-Latn': 'Azerbaijani (Latin)',
        'az-Cyrl-AZ': 'Azerbaijani (Cyrillic, Azerbaijan)',
        'az-Cyrl': 'Azerbaijani (Cyrillic)',
        'bas': 'Basaa',
        'bas-CM': 'Basaa (Cameroon)',
        'be': 'Belarusian',
        'be-TARASK': 'Belarusian (Taraskievica orthography)',
        'be-BY': 'Belarusian (Belarus)',
        'bem': 'Bemba',
        'bem-ZM': 'Bemba (Zambia)',
        'bez': 'Bena',
        'bez-TZ': 'Bena (Tanzania)',
        'bg': 'Bulgarian',
        'bg-BG': 'Bulgarian (Bulgaria)',
        'bm': 'Bambara',
        'bm-ML': 'Bambara (Mali)',
        'bn': 'Bangla',
        'bn-IN': 'Bangla (India)',
        'bn-BD': 'Bangla (Bangladesh)',
        'br': 'Breton',
        'br-FR': 'Breton (France)',
        'brx': 'Bodo',
        'brx-IN': 'Bodo (India)',
        'bs': 'Bosnian',
        'bs-Latn-BA': 'Bosnian (Latin, Bosnia & Herzegovina)',
        'bs-Latn': 'Bosnian (Latin)',
        'bs-Cyrl-BA': 'Bosnian (Cyrillic, Bosnia & Herzegovina)',
        'bs-Cyrl': 'Bosnian (Cyrillic)',
        'ca': 'Catalan',
        'ca-IT': 'Catalan (Italy)',
        'ca-FR': 'Catalan (France)',
        'ca-ES-VALENCIA': 'Catalan (Spain, Valencian)',
        'ca-ES': 'Catalan (Spain)',
        'ca-AD': 'Catalan (Andorra)',
        'ccp': 'Chakma',
        'ccp-IN': 'Chakma (India)',
        'ccp-BD': 'Chakma (Bangladesh)',
        'ce': 'Chechen',
        'ce-RU': 'Chechen (Russia)',
        'ceb': 'Cebuano',
        'ceb-PH': 'Cebuano (Philippines)',
        'cgg': 'Chiga',
        'cgg-UG': 'Chiga (Uganda)',
        'chr': 'Cherokee',
        'chr-US': 'Cherokee (United States)',
        'ckb': 'Central Kurdish',
        'ckb-IR': 'Central Kurdish (Iran)',
        'ckb-IQ': 'Central Kurdish (Iraq)',
        'cs': 'Czech',
        'cs-CZ': 'Czech (Czechia)',
        'cy': 'Welsh',
        'cy-GB': 'Welsh (United Kingdom)',
        'da': 'Danish',
        'da-GL': 'Danish (Greenland)',
        'da-DK': 'Danish (Denmark)',
        'dav': 'Taita',
        'dav-KE': 'Taita (Kenya)',
        'de': 'German',
        'de-LU': 'German (Luxembourg)',
        'de-LI': 'German (Liechtenstein)',
        'de-IT': 'German (Italy)',
        'de-DE': 'German (Germany)',
        'de-CH': 'Swiss High German',
        'de-BE': 'German (Belgium)',
        'de-AT': 'Austrian German',
        'dje': 'Zarma',
        'dje-NE': 'Zarma (Niger)',
        'doi': 'Dogri',
        'doi-IN': 'Dogri (India)',
        'dsb': 'Lower Sorbian',
        'dsb-DE': 'Lower Sorbian (Germany)',
        'dua': 'Duala',
        'dua-CM': 'Duala (Cameroon)',
        'dyo': 'Jola-Fonyi',
        'dyo-SN': 'Jola-Fonyi (Senegal)',
        'dz': 'Dzongkha',
        'dz-BT': 'Dzongkha (Bhutan)',
        'ebu': 'Embu',
        'ebu-KE': 'Embu (Kenya)',
        'ee': 'Ewe',
        'ee-TG': 'Ewe (Togo)',
        'ee-GH': 'Ewe (Ghana)',
        'el': 'Greek',
        'el-GR': 'Greek (Greece)',
        'el-CY': 'Greek (Cyprus)',
        'en': 'English',
        'en-ZW': 'English (Zimbabwe)',
        'en-ZM': 'English (Zambia)',
        'en-ZA': 'English (South Africa)',
        'en-WS': 'English (Samoa)',
        'en-VU': 'English (Vanuatu)',
        'en-VI': 'English (U.S. Virgin Islands)',
        'en-VG': 'English (British Virgin Islands)',
        'en-VC': 'English (St. Vincent & Grenadines)',
        'en-US-POSIX': 'American English (Computer)',
        'en-US': 'American English',
        'en-UM': 'English (U.S. Outlying Islands)',
        'en-UG': 'English (Uganda)',
        'en-TZ': 'English (Tanzania)',
        'en-TV': 'English (Tuvalu)',
        'en-TT': 'English (Trinidad & Tobago)',
        'en-TO': 'English (Tonga)',
        'en-TK': 'English (Tokelau)',
        'en-TC': 'English (Turks & Caicos Islands)',
        'en-SZ': 'English (Eswatini)',
        'en-SX': 'English (Sint Maarten)',
        'en-SS': 'English (South Sudan)',
        'en-SL': 'English (Sierra Leone)',
        'en-SI': 'English (Slovenia)',
        'en-SH': 'English (St. Helena)',
        'en-SG': 'English (Singapore)',
        'en-SE': 'English (Sweden)',
        'en-SD': 'English (Sudan)',
        'en-SC': 'English (Seychelles)',
        'en-SB': 'English (Solomon Islands)',
        'en-RW': 'English (Rwanda)',
        'en-PW': 'English (Palau)',
        'en-PR': 'English (Puerto Rico)',
        'en-PN': 'English (Pitcairn Islands)',
        'en-PK': 'English (Pakistan)',
        'en-PH': 'English (Philippines)',
        'en-PG': 'English (Papua New Guinea)',
        'en-NZ': 'English (New Zealand)',
        'en-NU': 'English (Niue)',
        'en-NR': 'English (Nauru)',
        'en-NL': 'English (Netherlands)',
        'en-NG': 'English (Nigeria)',
        'en-NF': 'English (Norfolk Island)',
        'en-NA': 'English (Namibia)',
        'en-MY': 'English (Malaysia)',
        'en-MW': 'English (Malawi)',
        'en-MV': 'English (Maldives)',
        'en-MU': 'English (Mauritius)',
        'en-MT': 'English (Malta)',
        'en-MS': 'English (Montserrat)',
        'en-MP': 'English (Northern Mariana Islands)',
        'en-MO': 'English (Macao SAR China)',
        'en-MH': 'English (Marshall Islands)',
        'en-MG': 'English (Madagascar)',
        'en-LS': 'English (Lesotho)',
        'en-LR': 'English (Liberia)',
        'en-LC': 'English (St. Lucia)',
        'en-KY': 'English (Cayman Islands)',
        'en-KN': 'English (St. Kitts & Nevis)',
        'en-KI': 'English (Kiribati)',
        'en-KE': 'English (Kenya)',
        'en-JM': 'English (Jamaica)',
        'en-JE': 'English (Jersey)',
        'en-IO': 'English (British Indian Ocean Territory)',
        'en-IN': 'English (India)',
        'en-IM': 'English (Isle of Man)',
        'en-IL': 'English (Israel)',
        'en-IE': 'English (Ireland)',
        'en-HK': 'English (Hong Kong SAR China)',
        'en-GY': 'English (Guyana)',
        'en-GU': 'English (Guam)',
        'en-GM': 'English (Gambia)',
        'en-GI': 'English (Gibraltar)',
        'en-GH': 'English (Ghana)',
        'en-GG': 'English (Guernsey)',
        'en-GD': 'English (Grenada)',
        'en-GB': 'British English',
        'en-FM': 'English (Micronesia)',
        'en-FK': 'English (Falkland Islands)',
        'en-FJ': 'English (Fiji)',
        'en-FI': 'English (Finland)',
        'en-ER': 'English (Eritrea)',
        'en-DM': 'English (Dominica)',
        'en-DK': 'English (Denmark)',
        'en-DG': 'English (Diego Garcia)',
        'en-DE': 'English (Germany)',
        'en-CY': 'English (Cyprus)',
        'en-CX': 'English (Christmas Island)',
        'en-CM': 'English (Cameroon)',
        'en-CK': 'English (Cook Islands)',
        'en-CH': 'English (Switzerland)',
        'en-CC': 'English (Cocos [Keeling] Islands)',
        'en-CA': 'Canadian English',
        'en-BZ': 'English (Belize)',
        'en-BW': 'English (Botswana)',
        'en-BS': 'English (Bahamas)',
        'en-BM': 'English (Bermuda)',
        'en-BI': 'English (Burundi)',
        'en-BE': 'English (Belgium)',
        'en-BB': 'English (Barbados)',
        'en-AU': 'Australian English',
        'en-AT': 'English (Austria)',
        'en-AS': 'English (American Samoa)',
        'en-AI': 'English (Anguilla)',
        'en-AG': 'English (Antigua & Barbuda)',
        'en-AE': 'English (United Arab Emirates)',
        'en-150': 'English (Europe)',
        'en-001': 'English (world)',
        'eo': 'Esperanto',
        'eo-001': 'Esperanto (world)',
        'es': 'Spanish',
        'es-VE': 'Spanish (Venezuela)',
        'es-UY': 'Spanish (Uruguay)',
        'es-US': 'Spanish (United States)',
        'es-SV': 'Spanish (El Salvador)',
        'es-PY': 'Spanish (Paraguay)',
        'es-PR': 'Spanish (Puerto Rico)',
        'es-PH': 'Spanish (Philippines)',
        'es-PE': 'Spanish (Peru)',
        'es-PA': 'Spanish (Panama)',
        'es-NI': 'Spanish (Nicaragua)',
        'es-MX': 'Mexican Spanish',
        'es-IC': 'Spanish (Canary Islands)',
        'es-HN': 'Spanish (Honduras)',
        'es-GT': 'Spanish (Guatemala)',
        'es-GQ': 'Spanish (Equatorial Guinea)',
        'es-ES': 'European Spanish',
        'es-EC': 'Spanish (Ecuador)',
        'es-EA': 'Spanish (Ceuta & Melilla)',
        'es-DO': 'Spanish (Dominican Republic)',
        'es-CU': 'Spanish (Cuba)',
        'es-CR': 'Spanish (Costa Rica)',
        'es-CO': 'Spanish (Colombia)',
        'es-CL': 'Spanish (Chile)',
        'es-BZ': 'Spanish (Belize)',
        'es-BR': 'Spanish (Brazil)',
        'es-BO': 'Spanish (Bolivia)',
        'es-AR': 'Spanish (Argentina)',
        'es-419': 'Latin American Spanish',
        'et': 'Estonian',
        'et-EE': 'Estonian (Estonia)',
        'eu': 'Basque',
        'eu-ES': 'Basque (Spain)',
        'ewo': 'Ewondo',
        'ewo-CM': 'Ewondo (Cameroon)',
        'fa': 'Persian',
        'fa-IR': 'Persian (Iran)',
        'fa-AF': 'Dari',
        'ff': 'Fulah',
        'ff-Latn-SN': 'Fulah (Latin, Senegal)',
        'ff-Latn-SL': 'Fulah (Latin, Sierra Leone)',
        'ff-Latn-NG': 'Fulah (Latin, Nigeria)',
        'ff-Latn-NE': 'Fulah (Latin, Niger)',
        'ff-Latn-MR': 'Fulah (Latin, Mauritania)',
        'ff-Latn-LR': 'Fulah (Latin, Liberia)',
        'ff-Latn-GW': 'Fulah (Latin, Guinea-Bissau)',
        'ff-Latn-GN': 'Fulah (Latin, Guinea)',
        'ff-Latn-GM': 'Fulah (Latin, Gambia)',
        'ff-Latn-GH': 'Fulah (Latin, Ghana)',
        'ff-Latn-CM': 'Fulah (Latin, Cameroon)',
        'ff-Latn-BF': 'Fulah (Latin, Burkina Faso)',
        'ff-Latn': 'Fulah (Latin)',
        'ff-Adlm-SN': 'Fulah (Adlam, Senegal)',
        'ff-Adlm-SL': 'Fulah (Adlam, Sierra Leone)',
        'ff-Adlm-NG': 'Fulah (Adlam, Nigeria)',
        'ff-Adlm-NE': 'Fulah (Adlam, Niger)',
        'ff-Adlm-MR': 'Fulah (Adlam, Mauritania)',
        'ff-Adlm-LR': 'Fulah (Adlam, Liberia)',
        'ff-Adlm-GW': 'Fulah (Adlam, Guinea-Bissau)',
        'ff-Adlm-GN': 'Fulah (Adlam, Guinea)',
        'ff-Adlm-GM': 'Fulah (Adlam, Gambia)',
        'ff-Adlm-GH': 'Fulah (Adlam, Ghana)',
        'ff-Adlm-CM': 'Fulah (Adlam, Cameroon)',
        'ff-Adlm-BF': 'Fulah (Adlam, Burkina Faso)',
        'ff-Adlm': 'Fulah (Adlam)',
        'fi': 'Finnish',
        'fi-FI': 'Finnish (Finland)',
        'fil': 'Filipino',
        'fil-PH': 'Filipino (Philippines)',
        'fo': 'Faroese',
        'fo-FO': 'Faroese (Faroe Islands)',
        'fo-DK': 'Faroese (Denmark)',
        'fr': 'French',
        'fr-YT': 'French (Mayotte)',
        'fr-WF': 'French (Wallis & Futuna)',
        'fr-VU': 'French (Vanuatu)',
        'fr-TN': 'French (Tunisia)',
        'fr-TG': 'French (Togo)',
        'fr-TD': 'French (Chad)',
        'fr-SY': 'French (Syria)',
        'fr-SN': 'French (Senegal)',
        'fr-SC': 'French (Seychelles)',
        'fr-RW': 'French (Rwanda)',
        'fr-RE': 'French (Réunion)',
        'fr-PM': 'French (St. Pierre & Miquelon)',
        'fr-PF': 'French (French Polynesia)',
        'fr-NE': 'French (Niger)',
        'fr-NC': 'French (New Caledonia)',
        'fr-MU': 'French (Mauritius)',
        'fr-MR': 'French (Mauritania)',
        'fr-MQ': 'French (Martinique)',
        'fr-ML': 'French (Mali)',
        'fr-MG': 'French (Madagascar)',
        'fr-MF': 'French (St. Martin)',
        'fr-MC': 'French (Monaco)',
        'fr-MA': 'French (Morocco)',
        'fr-LU': 'French (Luxembourg)',
        'fr-KM': 'French (Comoros)',
        'fr-HT': 'French (Haiti)',
        'fr-GQ': 'French (Equatorial Guinea)',
        'fr-GP': 'French (Guadeloupe)',
        'fr-GN': 'French (Guinea)',
        'fr-GF': 'French (French Guiana)',
        'fr-GA': 'French (Gabon)',
        'fr-FR': 'French (France)',
        'fr-DZ': 'French (Algeria)',
        'fr-DJ': 'French (Djibouti)',
        'fr-CM': 'French (Cameroon)',
        'fr-CI': 'French (Côte d’Ivoire)',
        'fr-CH': 'Swiss French',
        'fr-CG': 'French (Congo - Brazzaville)',
        'fr-CF': 'French (Central African Republic)',
        'fr-CD': 'French (Congo - Kinshasa)',
        'fr-CA': 'Canadian French',
        'fr-BL': 'French (St. Barthélemy)',
        'fr-BJ': 'French (Benin)',
        'fr-BI': 'French (Burundi)',
        'fr-BF': 'French (Burkina Faso)',
        'fr-BE': 'French (Belgium)',
        'fur': 'Friulian',
        'fur-IT': 'Friulian (Italy)',
        'fy': 'Western Frisian',
        'fy-NL': 'Western Frisian (Netherlands)',
        'ga': 'Irish',
        'ga-IE': 'Irish (Ireland)',
        'ga-GB': 'Irish (United Kingdom)',
        'gd': 'Scottish Gaelic',
        'gd-GB': 'Scottish Gaelic (United Kingdom)',
        'gl': 'Galician',
        'gl-ES': 'Galician (Spain)',
        'gsw': 'Swiss German',
        'gsw-LI': 'Swiss German (Liechtenstein)',
        'gsw-FR': 'Swiss German (France)',
        'gsw-CH': 'Swiss German (Switzerland)',
        'gu': 'Gujarati',
        'gu-IN': 'Gujarati (India)',
        'guz': 'Gusii',
        'guz-KE': 'Gusii (Kenya)',
        'gv': 'Manx',
        'gv-IM': 'Manx (Isle of Man)',
        'ha': 'Hausa',
        'ha-NG': 'Hausa (Nigeria)',
        'ha-NE': 'Hausa (Niger)',
        'ha-GH': 'Hausa (Ghana)',
        'haw': 'Hawaiian',
        'haw-US': 'Hawaiian (United States)',
        'he': 'Hebrew',
        'he-IL': 'Hebrew (Israel)',
        'hi': 'Hindi',
        'hi-Latn-IN': 'Hindi (Latin, India)',
        'hi-Latn': 'Hindi (Latin)',
        'hi-IN': 'Hindi (India)',
        'hr': 'Croatian',
        'hr-HR': 'Croatian (Croatia)',
        'hr-BA': 'Croatian (Bosnia & Herzegovina)',
        'hsb': 'Upper Sorbian',
        'hsb-DE': 'Upper Sorbian (Germany)',
        'hu': 'Hungarian',
        'hu-HU': 'Hungarian (Hungary)',
        'hy': 'Armenian',
        'hy-AM': 'Armenian (Armenia)',
        'ia': 'Interlingua',
        'ia-001': 'Interlingua (world)',
        'id': 'Indonesian',
        'id-ID': 'Indonesian (Indonesia)',
        'ig': 'Igbo',
        'ig-NG': 'Igbo (Nigeria)',
        'is': 'Icelandic',
        'is-IS': 'Icelandic (Iceland)',
        'it': 'Italian',
        'it-VA': 'Italian (Vatican City)',
        'it-SM': 'Italian (San Marino)',
        'it-IT': 'Italian (Italy)',
        'it-CH': 'Italian (Switzerland)',
        'ja': 'Japanese',
        'ja-JP': 'Japanese (Japan)',
        'jgo': 'Ngomba',
        'jgo-CM': 'Ngomba (Cameroon)',
        'jmc': 'Machame',
        'jmc-TZ': 'Machame (Tanzania)',
        'jv': 'Javanese',
        'jv-ID': 'Javanese (Indonesia)',
        'ka': 'Georgian',
        'ka-GE': 'Georgian (Georgia)',
        'kab': 'Kabyle',
        'kab-DZ': 'Kabyle (Algeria)',
        'kam': 'Kamba',
        'kam-KE': 'Kamba (Kenya)',
        'kde': 'Makonde',
        'kde-TZ': 'Makonde (Tanzania)',
        'kea': 'Kabuverdianu',
        'kea-CV': 'Kabuverdianu (Cape Verde)',
        'kgp': 'Kaingang',
        'kgp-BR': 'Kaingang (Brazil)',
        'khq': 'Koyra Chiini',
        'khq-ML': 'Koyra Chiini (Mali)',
        'ki': 'Kikuyu',
        'ki-KE': 'Kikuyu (Kenya)',
        'kk': 'Kazakh',
        'kk-KZ': 'Kazakh (Kazakhstan)',
        'kkj': 'Kako',
        'kkj-CM': 'Kako (Cameroon)',
        'kl': 'Kalaallisut',
        'kl-GL': 'Kalaallisut (Greenland)',
        'kln': 'Kalenjin',
        'kln-KE': 'Kalenjin (Kenya)',
        'km': 'Khmer',
        'km-KH': 'Khmer (Cambodia)',
        'kn': 'Kannada',
        'kn-IN': 'Kannada (India)',
        'ko': 'Korean',
        'ko-KR': 'Korean (South Korea)',
        'ko-KP': 'Korean (North Korea)',
        'kok': 'Konkani',
        'kok-IN': 'Konkani (India)',
        'ks': 'Kashmiri',
        'ks-Deva-IN': 'Kashmiri (Devanagari, India)',
        'ks-Deva': 'Kashmiri (Devanagari)',
        'ks-Arab-IN': 'Kashmiri (Arabic, India)',
        'ks-Arab': 'Kashmiri (Arabic)',
        'ksb': 'Shambala',
        'ksb-TZ': 'Shambala (Tanzania)',
        'ksf': 'Bafia',
        'ksf-CM': 'Bafia (Cameroon)',
        'ksh': 'Colognian',
        'ksh-DE': 'Colognian (Germany)',
        'ku': 'Kurdish',
        'ku-TR': 'Kurdish (Turkey)',
        'kw': 'Cornish',
        'kw-GB': 'Cornish (United Kingdom)',
        'ky': 'Kyrgyz',
        'ky-KG': 'Kyrgyz (Kyrgyzstan)',
        'lag': 'Langi',
        'lag-TZ': 'Langi (Tanzania)',
        'lb': 'Luxembourgish',
        'lb-LU': 'Luxembourgish (Luxembourg)',
        'lg': 'Ganda',
        'lg-UG': 'Ganda (Uganda)',
        'lkt': 'Lakota',
        'lkt-US': 'Lakota (United States)',
        'ln': 'Lingala',
        'ln-CG': 'Lingala (Congo - Brazzaville)',
        'ln-CF': 'Lingala (Central African Republic)',
        'ln-CD': 'Lingala (Congo - Kinshasa)',
        'ln-AO': 'Lingala (Angola)',
        'lo': 'Lao',
        'lo-LA': 'Lao (Laos)',
        'lrc': 'Northern Luri',
        'lrc-IR': 'Northern Luri (Iran)',
        'lrc-IQ': 'Northern Luri (Iraq)',
        'lt': 'Lithuanian',
        'lt-LT': 'Lithuanian (Lithuania)',
        'lu': 'Luba-Katanga',
        'lu-CD': 'Luba-Katanga (Congo - Kinshasa)',
        'luo': 'Luo',
        'luo-KE': 'Luo (Kenya)',
        'luy': 'Luyia',
        'luy-KE': 'Luyia (Kenya)',
        'lv': 'Latvian',
        'lv-LV': 'Latvian (Latvia)',
        'mai': 'Maithili',
        'mai-IN': 'Maithili (India)',
        'mas': 'Masai',
        'mas-TZ': 'Masai (Tanzania)',
        'mas-KE': 'Masai (Kenya)',
        'mer': 'Meru',
        'mer-KE': 'Meru (Kenya)',
        'mfe': 'Morisyen',
        'mfe-MU': 'Morisyen (Mauritius)',
        'mg': 'Malagasy',
        'mg-MG': 'Malagasy (Madagascar)',
        'mgh': 'Makhuwa-Meetto',
        'mgh-MZ': 'Makhuwa-Meetto (Mozambique)',
        'mgo': 'Metaʼ',
        'mgo-CM': 'Metaʼ (Cameroon)',
        'mi': 'Māori',
        'mi-NZ': 'Māori (New Zealand)',
        'mk': 'Macedonian',
        'mk-MK': 'Macedonian (North Macedonia)',
        'ml': 'Malayalam',
        'ml-IN': 'Malayalam (India)',
        'mn': 'Mongolian',
        'mn-MN': 'Mongolian (Mongolia)',
        'mni': 'Manipuri',
        'mni-Beng-IN': 'Manipuri (Bangla, India)',
        'mni-Beng': 'Manipuri (Bangla)',
        'mr': 'Marathi',
        'mr-IN': 'Marathi (India)',
        'ms': 'Malay',
        'ms-SG': 'Malay (Singapore)',
        'ms-MY': 'Malay (Malaysia)',
        'ms-ID': 'Malay (Indonesia)',
        'ms-BN': 'Malay (Brunei)',
        'mt': 'Maltese',
        'mt-MT': 'Maltese (Malta)',
        'mua': 'Mundang',
        'mua-CM': 'Mundang (Cameroon)',
        'my': 'Burmese',
        'my-MM': 'Burmese (Myanmar [Burma])',
        'mzn': 'Mazanderani',
        'mzn-IR': 'Mazanderani (Iran)',
        'naq': 'Nama',
        'naq-NA': 'Nama (Namibia)',
        'nb': 'Norwegian Bokmål',
        'nb-SJ': 'Norwegian Bokmål (Svalbard & Jan Mayen)',
        'nb-NO': 'Norwegian Bokmål (Norway)',
        'nd': 'North Ndebele',
        'nd-ZW': 'North Ndebele (Zimbabwe)',
        'nds': 'Low German',
        'nds-NL': 'Low Saxon',
        'nds-DE': 'Low German (Germany)',
        'ne': 'Nepali',
        'ne-NP': 'Nepali (Nepal)',
        'ne-IN': 'Nepali (India)',
        'nl': 'Dutch',
        'nl-SX': 'Dutch (Sint Maarten)',
        'nl-SR': 'Dutch (Suriname)',
        'nl-NL': 'Dutch (Netherlands)',
        'nl-CW': 'Dutch (Curaçao)',
        'nl-BQ': 'Dutch (Caribbean Netherlands)',
        'nl-BE': 'Flemish',
        'nl-AW': 'Dutch (Aruba)',
        'nmg': 'Kwasio',
        'nmg-CM': 'Kwasio (Cameroon)',
        'nn': 'Norwegian Nynorsk',
        'nn-NO': 'Norwegian Nynorsk (Norway)',
        'nnh': 'Ngiemboon',
        'nnh-CM': 'Ngiemboon (Cameroon)',
        'no': 'Norwegian',
        'nus': 'Nuer',
        'nus-SS': 'Nuer (South Sudan)',
        'nyn': 'Nyankole',
        'nyn-UG': 'Nyankole (Uganda)',
        'om': 'Oromo',
        'om-KE': 'Oromo (Kenya)',
        'om-ET': 'Oromo (Ethiopia)',
        'or': 'Odia',
        'or-IN': 'Odia (India)',
        'os': 'Ossetic',
        'os-RU': 'Ossetic (Russia)',
        'os-GE': 'Ossetic (Georgia)',
        'pa': 'Punjabi',
        'pa-Guru-IN': 'Punjabi (Gurmukhi, India)',
        'pa-Guru': 'Punjabi (Gurmukhi)',
        'pa-Arab-PK': 'Punjabi (Arabic, Pakistan)',
        'pa-Arab': 'Punjabi (Arabic)',
        'pcm': 'Nigerian Pidgin',
        'pcm-NG': 'Nigerian Pidgin (Nigeria)',
        'pl': 'Polish',
        'pl-PL': 'Polish (Poland)',
        'ps': 'Pashto',
        'ps-PK': 'Pashto (Pakistan)',
        'ps-AF': 'Pashto (Afghanistan)',
        'pt': 'Portuguese',
        'pt-TL': 'Portuguese (Timor-Leste)',
        'pt-ST': 'Portuguese (São Tomé & Príncipe)',
        'pt-PT': 'European Portuguese',
        'pt-MZ': 'Portuguese (Mozambique)',
        'pt-MO': 'Portuguese (Macao SAR China)',
        'pt-LU': 'Portuguese (Luxembourg)',
        'pt-GW': 'Portuguese (Guinea-Bissau)',
        'pt-GQ': 'Portuguese (Equatorial Guinea)',
        'pt-CV': 'Portuguese (Cape Verde)',
        'pt-CH': 'Portuguese (Switzerland)',
        'pt-BR': 'Brazilian Portuguese',
        'pt-AO': 'Portuguese (Angola)',
        'qu': 'Quechua',
        'qu-PE': 'Quechua (Peru)',
        'qu-EC': 'Quechua (Ecuador)',
        'qu-BO': 'Quechua (Bolivia)',
        'rm': 'Romansh',
        'rm-CH': 'Romansh (Switzerland)',
        'rn': 'Rundi',
        'rn-BI': 'Rundi (Burundi)',
        'ro': 'Romanian',
        'ro-RO': 'Romanian (Romania)',
        'ro-MD': 'Moldavian',
        'rof': 'Rombo',
        'rof-TZ': 'Rombo (Tanzania)',
        'ru': 'Russian',
        'ru-UA': 'Russian (Ukraine)',
        'ru-RU': 'Russian (Russia)',
        'ru-MD': 'Russian (Moldova)',
        'ru-KZ': 'Russian (Kazakhstan)',
        'ru-KG': 'Russian (Kyrgyzstan)',
        'ru-BY': 'Russian (Belarus)',
        'rw': 'Kinyarwanda',
        'rw-RW': 'Kinyarwanda (Rwanda)',
        'rwk': 'Rwa',
        'rwk-TZ': 'Rwa (Tanzania)',
        'sa': 'Sanskrit',
        'sa-IN': 'Sanskrit (India)',
        'sah': 'Sakha',
        'sah-RU': 'Sakha (Russia)',
        'saq': 'Samburu',
        'saq-KE': 'Samburu (Kenya)',
        'sat': 'Santali',
        'sat-Olck-IN': 'Santali (Ol Chiki, India)',
        'sat-Olck': 'Santali (Ol Chiki)',
        'sbp': 'Sangu',
        'sbp-TZ': 'Sangu (Tanzania)',
        'sc': 'Sardinian',
        'sc-IT': 'Sardinian (Italy)',
        'sd': 'Sindhi',
        'sd-Deva-IN': 'Sindhi (Devanagari, India)',
        'sd-Deva': 'Sindhi (Devanagari)',
        'sd-Arab-PK': 'Sindhi (Arabic, Pakistan)',
        'sd-Arab': 'Sindhi (Arabic)',
        'se': 'Northern Sami',
        'se-SE': 'Northern Sami (Sweden)',
        'se-NO': 'Northern Sami (Norway)',
        'se-FI': 'Northern Sami (Finland)',
        'seh': 'Sena',
        'seh-MZ': 'Sena (Mozambique)',
        'ses': 'Koyraboro Senni',
        'ses-ML': 'Koyraboro Senni (Mali)',
        'sg': 'Sango',
        'sg-CF': 'Sango (Central African Republic)',
        'shi': 'Tachelhit',
        'shi-Tfng-MA': 'Tachelhit (Tifinagh, Morocco)',
        'shi-Tfng': 'Tachelhit (Tifinagh)',
        'shi-Latn-MA': 'Tachelhit (Latin, Morocco)',
        'shi-Latn': 'Tachelhit (Latin)',
        'si': 'Sinhala',
        'si-LK': 'Sinhala (Sri Lanka)',
        'sk': 'Slovak',
        'sk-SK': 'Slovak (Slovakia)',
        'sl': 'Slovenian',
        'sl-SI': 'Slovenian (Slovenia)',
        'smn': 'Inari Sami',
        'smn-FI': 'Inari Sami (Finland)',
        'sn': 'Shona',
        'sn-ZW': 'Shona (Zimbabwe)',
        'so': 'Somali',
        'so-SO': 'Somali (Somalia)',
        'so-KE': 'Somali (Kenya)',
        'so-ET': 'Somali (Ethiopia)',
        'so-DJ': 'Somali (Djibouti)',
        'sq': 'Albanian',
        'sq-XK': 'Albanian (Kosovo)',
        'sq-MK': 'Albanian (North Macedonia)',
        'sq-AL': 'Albanian (Albania)',
        'sr': 'Serbian',
        'sr-Latn-XK': 'Serbian (Latin, Kosovo)',
        'sr-Latn-RS': 'Serbian (Latin, Serbia)',
        'sr-Latn-ME': 'Montenegrin (Latin)',
        'sr-Latn-BA': 'Serbian (Latin, Bosnia & Herzegovina)',
        'sr-Latn': 'Serbian (Latin)',
        'sr-Cyrl-XK': 'Serbian (Cyrillic, Kosovo)',
        'sr-Cyrl-RS': 'Serbian (Cyrillic, Serbia)',
        'sr-Cyrl-ME': 'Montenegrin (Cyrillic)',
        'sr-Cyrl-BA': 'Serbian (Cyrillic, Bosnia & Herzegovina)',
        'sr-Cyrl': 'Serbian (Cyrillic)',
        'su': 'Sundanese',
        'su-Latn-ID': 'Sundanese (Latin, Indonesia)',
        'su-Latn': 'Sundanese (Latin)',
        'sv': 'Swedish',
        'sv-SE': 'Swedish (Sweden)',
        'sv-FI': 'Swedish (Finland)',
        'sv-AX': 'Swedish (Åland Islands)',
        'sw': 'Swahili',
        'sw-UG': 'Swahili (Uganda)',
        'sw-TZ': 'Swahili (Tanzania)',
        'sw-KE': 'Swahili (Kenya)',
        'sw-CD': 'Congo Swahili',
        'ta': 'Tamil',
        'ta-SG': 'Tamil (Singapore)',
        'ta-MY': 'Tamil (Malaysia)',
        'ta-LK': 'Tamil (Sri Lanka)',
        'ta-IN': 'Tamil (India)',
        'te': 'Telugu',
        'te-IN': 'Telugu (India)',
        'teo': 'Teso',
        'teo-UG': 'Teso (Uganda)',
        'teo-KE': 'Teso (Kenya)',
        'tg': 'Tajik',
        'tg-TJ': 'Tajik (Tajikistan)',
        'th': 'Thai',
        'th-TH': 'Thai (Thailand)',
        'ti': 'Tigrinya',
        'ti-ET': 'Tigrinya (Ethiopia)',
        'ti-ER': 'Tigrinya (Eritrea)',
        'tk': 'Turkmen',
        'tk-TM': 'Turkmen (Turkmenistan)',
        'to': 'Tongan',
        'to-TO': 'Tongan (Tonga)',
        'tr': 'Turkish',
        'tr-TR': 'Turkish (Turkey)',
        'tr-CY': 'Turkish (Cyprus)',
        'tt': 'Tatar',
        'tt-RU': 'Tatar (Russia)',
        'twq': 'Tasawaq',
        'twq-NE': 'Tasawaq (Niger)',
        'tzm': 'Central Atlas Tamazight',
        'tzm-MA': 'Central Atlas Tamazight (Morocco)',
        'ug': 'Uyghur',
        'ug-CN': 'Uyghur (China)',
        'uk': 'Ukrainian',
        'uk-UA': 'Ukrainian (Ukraine)',
        'ur': 'Urdu',
        'ur-PK': 'Urdu (Pakistan)',
        'ur-IN': 'Urdu (India)',
        'uz': 'Uzbek',
        'uz-Latn-UZ': 'Uzbek (Latin, Uzbekistan)',
        'uz-Latn': 'Uzbek (Latin)',
        'uz-Cyrl-UZ': 'Uzbek (Cyrillic, Uzbekistan)',
        'uz-Cyrl': 'Uzbek (Cyrillic)',
        'uz-Arab-AF': 'Uzbek (Arabic, Afghanistan)',
        'uz-Arab': 'Uzbek (Arabic)',
        'vai': 'Vai',
        'vai-Vaii-LR': 'Vai (Vai, Liberia)',
        'vai-Vaii': 'Vai (Vai)',
        'vai-Latn-LR': 'Vai (Latin, Liberia)',
        'vai-Latn': 'Vai (Latin)',
        'vi': 'Vietnamese',
        'vi-VN': 'Vietnamese (Vietnam)',
        'vun': 'Vunjo',
        'vun-TZ': 'Vunjo (Tanzania)',
        'wae': 'Walser',
        'wae-CH': 'Walser (Switzerland)',
        'wo': 'Wolof',
        'wo-SN': 'Wolof (Senegal)',
        'xh': 'Xhosa',
        'xh-ZA': 'Xhosa (South Africa)',
        'xog': 'Soga',
        'xog-UG': 'Soga (Uganda)',
        'yav': 'Yangben',
        'yav-CM': 'Yangben (Cameroon)',
        'yi': 'Yiddish',
        'yi-001': 'Yiddish (world)',
        'yo': 'Yoruba',
        'yo-NG': 'Yoruba (Nigeria)',
        'yo-BJ': 'Yoruba (Benin)',
        'yrl': 'Nheengatu',
        'yrl-VE': 'Nheengatu (Venezuela)',
        'yrl-CO': 'Nheengatu (Colombia)',
        'yrl-BR': 'Nheengatu (Brazil)',
        'zgh': 'Standard Moroccan Tamazight',
        'zgh-MA': 'Standard Moroccan Tamazight (Morocco)',
        'zh': 'Chinese',
        'zh-Hans-CN': 'Simplified Chinese (China)',
        'zh-Hans-HK': 'Simplified Chinese (Hong Kong SAR China)',
        'zh-Hans-MO': 'Simplified Chinese (Macao SAR China)',
        'zh-Hans-SG': 'Simplified Chinese (Singapore)',
        'zh-Hans': 'Simplified Chinese',
        'zh-Hant-TW': 'Traditional Chinese (Taiwan)',
        'zh-Hant-MO': 'Traditional Chinese (Macao SAR China)',
        'zh-Hant-HK': 'Traditional Chinese (Hong Kong SAR China)',
        'zh-Hant': 'Traditional Chinese',
        'zu': 'Zulu',
        'zu-ZA': 'Zulu (South Africa)',
    },
    error: {
        'editor_dirty': 'Unsaved content is currently detected, please save the project first',
        'translate_api_error': 'Error in translation request, please report',
        'unknown_file_type': 'Unknown file type: {}',
        'target_translate_data_not_found': 'Target language not found: {}',
        'target_translate_data_exist': 'Target language already exists: {}',
        'local_language_not_set': 'No local development language set',
        'translate_provider_config_not_found': 'Translator credentials not set',
        'provider_tag_not_found': 'Please first select a language for service provider identification',
        'translate_item_not_found': 'No translation data found: {}',
        'scan_option_empty': 'Scan options are empty',
        'provider_input_error': '{}',
        'auto_translate_network_error': 'Network error: {}',
        'po_file_language_not_equal': 'Imported PO file\'s [Language] not equal to target language',
        'unavailable_csv_file': 'Unavailable CSV file {}',
        'unavailable_xlsx_file': 'Unavailable XLSX file {}',
        'unknown_error': 'Unknown error',
        'merge_different_key': 'Attempt to merge data with two different keys',
        'index_translate_data_not_found': 'Corrupted data, not found localization-editor/index.yaml',
        'scene_error': 'Unknown scene error, please try to re-import the plugin resources or restart the editor',
        'invalid_translate_data': 'Invalid translate data: {}',
        'invalid_translate_file_content': 'Invalid translate file content: {}',
        "YOUDAO": {
            'error': 'YouDao error: {errorCode}, {message}',
            'errorCode': 'YouDao error code: {errorCode}, please see the corresponding information in [error code list] in https://ai.youdao.com/DOCSIRMA/html/%E8%87%AA%E7%84%B6%E8%AF%AD%E8%A8%80%E7%BF%BB%E8%AF%91/API%E6%96%87%E6%A1%A3/%E6%96%87%E6%9C%AC%E7%BF%BB%E8%AF%91%E6%9C%8D%E5%8A%A1/%E6%96%87%E6%9C%AC%E7%BF%BB%E8%AF%91%E6%9C%8D%E5%8A%A1-API%E6%96%87%E6%A1%A3.html',
            '207': 'Replay request',
            '301': 'Thesaurus query failed',
            '302': 'Translation query failed',
            '1412': 'Maximum number of recognized bytes exceeded',
            '2004': 'Synthesis character is too long',
            '2412': 'Exceeded the maximum number of requested characters',
            '3412': 'Exceeded the maximum number of requested characters',
        }
    },
};

