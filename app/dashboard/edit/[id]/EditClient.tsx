'use client';

import { ChangeEvent, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { uploadSiteImage } from '@/lib/image-upload';

type Service = {
  name: string;
  price: string;
  description: string;
  image: string;
};

type FormDataType = {
  siteName: string;
  about: string;
  heroImage: string;
  services: Service[];
  phone: string;
  whatsapp: string;
  location: string;
  openingHours: string;
  googleMapsUrl: string;
};

export default function EditClient({
  siteId,
  siteSlug,
  initialData,
}: {
  siteId: string;
  siteSlug: string;
  initialData: FormDataType;
}) {
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [isSaving, setIsSaving] = useState(false);
  const [isHeroUploading, setIsHeroUploading] = useState(false);
  const [serviceUploadState, setServiceUploadState] = useState<boolean[]>([
    false,
    false,
    false,
  ]);
  const [formData, setFormData] = useState<FormDataType>(initialData);

  const totalSteps = 4;
  const uploadFolder = `site-${siteId}`;
  const hasPendingUpload =
    isHeroUploading || serviceUploadState.some((isUploading) => isUploading);

  const filledServices = useMemo(
    () =>
      formData.services.filter(
        (s) =>
          s.name.trim() ||
          s.price.trim() ||
          s.description.trim() ||
          s.image,
      ),
    [formData.services],
  );

  const updateBasicField = (
    field: keyof Omit<FormDataType, 'services'>,
    value: string,
  ) => setFormData((prev) => ({ ...prev, [field]: value }));

  const updateServiceField = (
    index: number,
    field: keyof Service,
    value: string,
  ) =>
    setFormData((prev) => {
      const updated = [...prev.services];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, services: updated };
    });

  const setServiceUploading = (index: number, value: boolean) => {
    setServiceUploadState((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  };

  const handleHeroImageUpload = async (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsHeroUploading(true);
      const imageUrl = await uploadSiteImage(file, `${uploadFolder}/hero`);
      setFormData((prev) => ({
        ...prev,
        heroImage: imageUrl,
      }));
    } catch (error) {
      console.error('Failed to upload hero image:', error);
      alert(
        error instanceof Error
          ? error.message
          : 'Could not upload that image. Please try another file.',
      );
    } finally {
      setIsHeroUploading(false);
      event.target.value = '';
    }
  };

  const handleServiceImageUpload = async (
    index: number,
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setServiceUploading(index, true);
      const imageUrl = await uploadSiteImage(
        file,
        `${uploadFolder}/services/service-${index + 1}`,
      );
      updateServiceField(index, 'image', imageUrl);
    } catch (error) {
      console.error('Failed to upload service image:', error);
      alert(
        error instanceof Error
          ? error.message
          : 'Could not upload that image. Please try another file.',
      );
    } finally {
      setServiceUploading(index, false);
      event.target.value = '';
    }
  };

  const nextStep = () => {
    if (step < totalSteps) {
      setStep((p) => p + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const previousStep = () => {
    if (step > 1) {
      setStep((p) => p - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const saveChanges = async () => {
    try {
      setIsSaving(true);
      const response = await fetch(`/api/sites/${siteId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error);
      router.push(`/sites/${result.slug || siteSlug}`);
    } catch (error) {
      console.error(error);
      alert('Failed to save changes. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const isStepOneValid =
    formData.siteName.trim().length > 0 && formData.about.trim().length > 0;
  const isStepTwoValid = filledServices.length > 0;
  const isStepThreeValid =
    formData.phone.trim().length > 0 ||
    formData.whatsapp.trim().length > 0 ||
    formData.location.trim().length > 0 ||
    formData.openingHours.trim().length > 0;

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto w-full max-w-3xl px-4 py-6 sm:px-6 sm:py-10">
        <div className="mb-6 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200 sm:p-7">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-sky-600">Editing Site</p>
              <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                {formData.siteName || 'Your Site'}
              </h1>
            </div>
            <Link
              href="/dashboard"
              style={{
                fontSize: '13px',
                color: '#64748b',
                textDecoration: 'none',
                padding: '8px 16px',
                borderRadius: '10px',
                background: '#f1f5f9',
                fontWeight: 600,
              }}
            >
              ← Dashboard
            </Link>
          </div>
          <div className="mt-3 flex gap-3">
            <a
              href={`/sites/${siteSlug}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontSize: '13px',
                color: '#2563eb',
                textDecoration: 'none',
                fontWeight: 600,
              }}
            >
              View live site →
            </a>
          </div>
        </div>

        <div className="mb-5 flex flex-wrap gap-2">
          {['Basic Info', 'Services', 'Contact', 'Preview'].map(
            (label, index) => {
              const current = index + 1 === step;
              return (
                <div
                  key={label}
                  className={`rounded-full px-4 py-2 text-xs font-medium sm:text-sm ${
                    current
                      ? 'bg-slate-900 text-white'
                      : 'bg-white text-slate-600 ring-1 ring-slate-200'
                  }`}
                >
                  {index + 1}. {label}
                </div>
              );
            },
          )}
        </div>

        <div className="rounded-3xl bg-white p-4 shadow-sm ring-1 ring-slate-200 sm:p-6">
          {step === 1 && (
            <section>
              <h2 className="text-xl font-semibold text-slate-900">
                Basic Info
              </h2>
              <p className="mt-1 text-sm text-slate-600">
                Update your business name and description.
              </p>
              <div className="mt-6 space-y-5">
                <div>
                  <label
                    htmlFor="siteName"
                    className="mb-2 block text-sm font-medium text-slate-700"
                  >
                    Site Name
                  </label>
                  <input
                    id="siteName"
                    type="text"
                    autoFocus
                    value={formData.siteName}
                    onChange={(e) =>
                      updateBasicField('siteName', e.target.value)
                    }
                    className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-900"
                  />
                </div>
                <div>
                  <label
                    htmlFor="about"
                    className="mb-2 block text-sm font-medium text-slate-700"
                  >
                    About
                  </label>
                  <textarea
                    id="about"
                    rows={6}
                    value={formData.about}
                    onChange={(e) => updateBasicField('about', e.target.value)}
                    className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-900"
                  />
                </div>
                <div>
                  <label
                    htmlFor="heroImage"
                    className="mb-2 block text-sm font-medium text-slate-700"
                  >
                    Hero Image
                  </label>
                  <input
                    id="heroImage"
                    type="file"
                    accept="image/*"
                    onChange={handleHeroImageUpload}
                    className="block w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm text-slate-700 file:mr-4 file:rounded-xl file:border-0 file:bg-slate-900 file:px-4 file:py-2 file:text-sm file:font-medium file:text-white"
                  />
                  {isHeroUploading && (
                    <p className="mt-2 text-sm text-sky-600">
                      Uploading hero image...
                    </p>
                  )}
                  {formData.heroImage && (
                    <div className="mt-4">
                      <img
                        src={formData.heroImage}
                        alt="Hero preview"
                        className="h-40 w-full rounded-2xl object-cover ring-1 ring-slate-200"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setFormData((prev) => ({ ...prev, heroImage: '' }))
                        }
                        className="mt-3 rounded-xl bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200"
                      >
                        Remove Image
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </section>
          )}

          {step === 2 && (
            <section>
              <h2 className="text-xl font-semibold text-slate-900">
                Services
              </h2>
              <p className="mt-1 text-sm text-slate-600">
                Update your services. Each one can have one image.
              </p>
              <div className="mt-6 space-y-6">
                {formData.services.map((service, index) => (
                  <div
                    key={index}
                    className="rounded-3xl border border-slate-200 p-4 sm:p-5"
                  >
                    <h3 className="text-base font-semibold text-slate-900">
                      Service {index + 1}
                    </h3>
                    <div className="mt-4 space-y-4">
                      <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700">
                          Service Name
                        </label>
                        <input
                          type="text"
                          value={service.name}
                          onChange={(e) =>
                            updateServiceField(index, 'name', e.target.value)
                          }
                          placeholder="e.g. Scaffolding Rental"
                          className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-900"
                        />
                      </div>
                      <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700">
                          Price
                        </label>
                        <input
                          type="text"
                          value={service.price}
                          onChange={(e) =>
                            updateServiceField(index, 'price', e.target.value)
                          }
                          placeholder="From G$400 per pair per day"
                          className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-900"
                        />
                      </div>
                      <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700">
                          Description
                        </label>
                        <textarea
                          rows={4}
                          value={service.description}
                          onChange={(e) =>
                            updateServiceField(
                              index,
                              'description',
                              e.target.value,
                            )
                          }
                          placeholder="Describe the service clearly."
                          className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-900"
                        />
                      </div>
                      <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700">
                          Service Image
                        </label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleServiceImageUpload(index, e)}
                          className="block w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm text-slate-700 file:mr-4 file:rounded-xl file:border-0 file:bg-slate-900 file:px-4 file:py-2 file:text-sm file:font-medium file:text-white"
                        />
                        {serviceUploadState[index] && (
                          <p className="mt-2 text-sm text-sky-600">
                            Uploading service image...
                          </p>
                        )}
                        {service.image && (
                          <div className="mt-4">
                            <img
                              src={service.image}
                              alt={`Service ${index + 1}`}
                              className="h-40 w-full rounded-2xl object-cover ring-1 ring-slate-200"
                            />
                            <button
                              type="button"
                              onClick={() =>
                                updateServiceField(index, 'image', '')
                              }
                              className="mt-3 rounded-xl bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200"
                            >
                              Remove Image
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {step === 3 && (
            <section>
              <h2 className="text-xl font-semibold text-slate-900">
                Contact Info
              </h2>
              <p className="mt-1 text-sm text-slate-600">
                Update how customers can reach you.
              </p>
              <div className="mt-6 space-y-5">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Phone
                  </label>
                  <input
                    type="text"
                    autoFocus
                    value={formData.phone}
                    onChange={(e) =>
                      updateBasicField('phone', e.target.value)
                    }
                    placeholder="+592 ..."
                    className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-900"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    WhatsApp
                  </label>
                  <input
                    type="text"
                    value={formData.whatsapp}
                    onChange={(e) =>
                      updateBasicField('whatsapp', e.target.value)
                    }
                    placeholder="+592 ..."
                    className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-900"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Location
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) =>
                      updateBasicField('location', e.target.value)
                    }
                    placeholder="Georgetown, Guyana"
                    className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-900"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Opening Hours
                  </label>
                  <textarea
                    rows={4}
                    value={formData.openingHours}
                    onChange={(e) =>
                      updateBasicField('openingHours', e.target.value)
                    }
                    placeholder={`Mon - Fri: 8am - 5pm\nSat: Closed`}
                    className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-900"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Google Maps Link
                  </label>
                  <input
                    type="text"
                    value={formData.googleMapsUrl}
                    onChange={(e) =>
                      updateBasicField('googleMapsUrl', e.target.value)
                    }
                    placeholder="https://maps.app.goo.gl/..."
                    className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-900"
                  />
                </div>
              </div>
            </section>
          )}

          {step === 4 && (
            <section>
              <h2 className="text-xl font-semibold text-slate-900">Preview</h2>
              <p className="mt-1 text-sm text-slate-600">
                Review your changes before saving.
              </p>
              <div className="mt-6 overflow-hidden rounded-[2rem] bg-slate-950 text-white shadow-xl">
                <div className="px-5 py-10 sm:px-8 sm:py-14">
                  <h1 className="text-3xl font-bold tracking-tight sm:text-5xl">
                    {formData.siteName || 'Your Business Name'}
                  </h1>
                  <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
                    {formData.about || 'Your description will appear here.'}
                  </p>
                </div>
                <div className="bg-white px-5 py-8 text-slate-900 sm:px-8 sm:py-10">
                  <section>
                    <h3 className="text-2xl font-bold">Services</h3>
                    <div className="mt-6 grid grid-cols-1 gap-5">
                      {(filledServices.length > 0
                        ? filledServices
                        : formData.services
                      ).map((service, index) => (
                        <div
                          key={index}
                          className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm"
                        >
                          {service.image ? (
                            <img
                              src={service.image}
                              alt={service.name || `Service ${index + 1}`}
                              className="h-52 w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-52 w-full items-center justify-center bg-slate-100 text-sm text-slate-400">
                              Service image
                            </div>
                          )}
                          <div className="p-5">
                            <h4 className="text-lg font-semibold">
                              {service.name || `Service ${index + 1}`}
                            </h4>
                            {service.price && (
                              <p className="mt-2 text-sm font-medium text-sky-700">
                                {service.price}
                              </p>
                            )}
                            <p className="mt-3 text-sm leading-6 text-slate-600">
                              {service.description ||
                                'Service description will appear here.'}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                  <section className="mt-10">
                    <h3 className="text-2xl font-bold">Contact</h3>
                    <div className="mt-5 space-y-3 text-sm leading-6 text-slate-700">
                      {formData.phone && (
                        <p>
                          <span className="font-semibold text-slate-900">
                            Phone:
                          </span>{' '}
                          {formData.phone}
                        </p>
                      )}
                      {formData.whatsapp && (
                        <p>
                          <span className="font-semibold text-slate-900">
                            WhatsApp:
                          </span>{' '}
                          {formData.whatsapp}
                        </p>
                      )}
                      {formData.location && (
                        <p>
                          <span className="font-semibold text-slate-900">
                            Location:
                          </span>{' '}
                          {formData.location}
                        </p>
                      )}
                      {formData.openingHours && (
                        <div>
                          <span className="font-semibold text-slate-900">
                            Hours:
                          </span>
                          <p className="mt-1 whitespace-pre-line text-slate-700">
                            {formData.openingHours}
                          </p>
                        </div>
                      )}
                    </div>
                  </section>
                </div>
              </div>
            </section>
          )}

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="button"
              onClick={previousStep}
              disabled={step === 1}
              className="w-full rounded-2xl bg-slate-100 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
            >
              Back
            </button>

            {step < totalSteps ? (
              <button
                type="button"
                onClick={nextStep}
                disabled={
                  hasPendingUpload ||
                  (step === 1 && !isStepOneValid) ||
                  (step === 2 && !isStepTwoValid) ||
                  (step === 3 && !isStepThreeValid)
                }
                className="w-full rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
              >
                {hasPendingUpload ? 'Waiting for uploads...' : 'Next'}
              </button>
            ) : (
              <button
                type="button"
                onClick={saveChanges}
                disabled={isSaving || hasPendingUpload}
                className="w-full rounded-2xl bg-sky-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
              >
                {isSaving
                  ? 'Saving...'
                  : hasPendingUpload
                    ? 'Waiting for uploads...'
                    : 'Save Changes'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
