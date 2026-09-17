#!/usr/bin/env python3
"""
Content validation script
- Check src/data/*.ts file quantity and field completeness
- Exit code 0: pass, 1: fail
"""

import json
import re
import sys
from pathlib import Path

# Windows UTF-8 output support
if sys.platform == "win32":
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8")


def read_ts_file(file_path: Path) -> str:
    """Read TypeScript file"""
    with open(file_path, "r", encoding="utf-8") as f:
        return f.read()


def validate_destinations(data_path: Path) -> tuple[bool, list[str]]:
    """Validate destinations.ts"""
    errors = []
    dest_file = data_path / "destinations.ts"

    if not dest_file.exists():
        return False, ["destinations.ts file not found"]

    content = read_ts_file(dest_file)

    # Check minimum counts (via regex)
    domestic_count = len(re.findall(r'region:\s*"domestic"', content))
    overseas_count = len(re.findall(r'region:\s*"overseas"', content))

    if domestic_count < 10:
        errors.append(
            f"Domestic destinations insufficient: {domestic_count} (minimum 10 required)"
        )

    if overseas_count < 30:
        errors.append(
            f"Overseas destinations insufficient: {overseas_count} (minimum 30 required)"
        )

    # Validate required fields
    required_fields = [
        "id:",
        "name:",
        "country:",
        "summary:",
        "attractions:",
        "bestSeason:",
        "itinerary:",
        "budgetGuide:",
        "transportation:",
        "food:",
        "etiquette:",
        "sourceUrl:",
        "lastVerifiedAt:",
        "image:",
    ]

    for field in required_fields:
        if content.count(field) < domestic_count + overseas_count:
            errors.append(f"Missing required field '{field}'")

    return len(errors) == 0, errors


def validate_safety(data_path: Path) -> tuple[bool, list[str]]:
    """Validate safety.ts"""
    errors = []
    safety_file = data_path / "safety.ts"

    if not safety_file.exists():
        return False, ["safety.ts file not found"]

    content = read_ts_file(safety_file)

    # Check country count (minimum 10 overseas countries)
    country_pattern = r'country:\s*"([^"]+)"'
    countries = re.findall(country_pattern, content)

    if len(countries) < 10:
        errors.append(f"Insufficient countries: {len(countries)} (minimum 10 required)")

    # Check 8 categories per country
    category_count = content.count("category:")
    expected_categories = len(countries) * 8

    if category_count < expected_categories:
        errors.append(
            f"Insufficient safety categories: {category_count} (minimum {expected_categories} required)"
        )

    # Check required fields
    required_fields = [
        "countryCode:",
        "scopeType:",
        "scopeText:",
        "categories:",
        "emergencyContacts:",
        "sourceUrl:",
        "lastVerifiedAt:",
    ]

    for field in required_fields:
        if content.count(field) < len(countries):
            errors.append(f"Missing required field '{field}'")

    return len(errors) == 0, errors


def validate_about(data_path: Path) -> tuple[bool, list[str]]:
    """Validate about.ts"""
    errors = []
    about_file = data_path / "about.ts"

    if not about_file.exists():
        return False, ["about.ts file not found"]

    content = read_ts_file(about_file)

    # Check timeline entries (minimum 6)
    timeline_count = len(re.findall(r"year:\s*\d{4}", content))

    if timeline_count < 6:
        errors.append(
            f"Insufficient timeline entries: {timeline_count} (minimum 6 required)"
        )

    # Check recommended destinations (minimum 4)
    recommended_count = content.count("destinationId:")

    if recommended_count < 4:
        errors.append(
            f"Insufficient recommended destinations: {recommended_count} (minimum 4 required)"
        )

    # Check required fields
    required_fields = [
        "name:",
        "tagline:",
        "introduction:",
        "philosophy:",
        "countriesVisited:",
        "tripsCompleted:",
        "yearsOfExperience:",
        "timeline:",
        "recommendedDestinations:",
    ]

    for field in required_fields:
        if field not in content:
            errors.append(f"Missing required field '{field}'")

    return len(errors) == 0, errors


def main():
    """Main validation function"""
    data_path = Path(__file__).parent.parent / "src" / "data"

    print("=" * 60)
    print("Content Completeness Validation")
    print("=" * 60)

    all_pass = True

    # Validate destinations.ts
    print("\n[destinations.ts] Validating...")
    dest_pass, dest_errors = validate_destinations(data_path)
    if dest_pass:
        print("[PASS] destinations.ts: OK")
    else:
        print("[FAIL] destinations.ts: FAILED")
        for error in dest_errors:
            print(f"  - {error}")
        all_pass = False

    # Validate safety.ts
    print("\n[safety.ts] Validating...")
    safety_pass, safety_errors = validate_safety(data_path)
    if safety_pass:
        print("[PASS] safety.ts: OK")
    else:
        print("[FAIL] safety.ts: FAILED")
        for error in safety_errors:
            print(f"  - {error}")
        all_pass = False

    # Validate about.ts
    print("\n[about.ts] Validating...")
    about_pass, about_errors = validate_about(data_path)
    if about_pass:
        print("[PASS] about.ts: OK")
    else:
        print("[FAIL] about.ts: FAILED")
        for error in about_errors:
            print(f"  - {error}")
        all_pass = False

    print("\n" + "=" * 60)
    if all_pass:
        print("[PASS] All content validation passed!")
        print("=" * 60)
        return 0
    else:
        print("[FAIL] Content validation failed - fix errors above")
        print("=" * 60)
        return 1


if __name__ == "__main__":
    sys.exit(main())
