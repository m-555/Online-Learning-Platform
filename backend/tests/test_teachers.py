def test_list_teachers_default_sort_is_top_rated(seeded_client):
    resp = seeded_client.get("/api/teachers")
    assert resp.status_code == 200
    teachers = resp.json()
    assert len(teachers) == 4
    # Marc L. has the highest rating (5.0) so he comes first.
    assert teachers[0]["full_name"] == "Marc L."
    assert teachers[0]["rating"] == 5.0


def test_filter_teachers_by_language(seeded_client):
    resp = seeded_client.get("/api/teachers", params={"language": "lb"})
    assert resp.status_code == 200
    names = {t["full_name"] for t in resp.json()}
    # Only Marc and Julie teach Luxembourgish in the seed data.
    assert names == {"Marc L.", "Julie T."}


def test_search_teachers_by_text(seeded_client):
    resp = seeded_client.get("/api/teachers", params={"q": "business"})
    assert resp.status_code == 200
    names = {t["full_name"] for t in resp.json()}
    assert names == {"Amal D."}


def test_sort_teachers_by_price_low(seeded_client):
    resp = seeded_client.get("/api/teachers", params={"sort": "price_low"})
    rates = [t["hourly_rate"] for t in resp.json()]
    assert rates == sorted(rates)
    assert rates[0] == 15.0  # Julie T.


def test_get_teacher_detail_and_404(seeded_client):
    listed = seeded_client.get("/api/teachers").json()
    first_id = listed[0]["id"]
    assert seeded_client.get(f"/api/teachers/{first_id}").status_code == 200
    assert seeded_client.get("/api/teachers/999999").status_code == 404
