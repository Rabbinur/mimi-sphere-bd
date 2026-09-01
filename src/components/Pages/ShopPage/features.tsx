interface Feature {
    icon: string;
    title: string;
    description: string;
}

interface Props {
    features: Feature[];
}

const FeaturesSection: React.FC<Props> = ({ features }) => {
    return (
        <section className="border-t border-slate-100 bg-white py-10">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-slate-100 rounded-2xl overflow-hidden border border-slate-100 shadow-sm">
                    {features.map((feature, index) => (
                        <div
                            key={feature.title}
                            className="bg-white flex flex-col sm:flex-row items-start sm:items-center gap-3 px-5 py-6 hover:bg-orange-50/40 transition-colors duration-200 group"
                        >
                            <div className="shrink-0 w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-lg group-hover:bg-primary group-hover:scale-110 transition-all duration-300">
                                <span className="leading-none">{feature.icon}</span>
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-800 text-sm leading-tight">
                                    {feature.title}
                                </h3>
                                <p className="text-[12px] text-slate-400 mt-0.5 leading-snug">
                                    {feature.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FeaturesSection;